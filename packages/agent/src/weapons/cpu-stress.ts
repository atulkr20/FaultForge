import { execSync, spawn, ChildProcess } from "child_process";
import os from 'os';
import { Worker } from "worker_threads";
import { CpuStressPayload } from "@faultforge/shared";
import { isCancelled } from "../executor";

let currentProcess: ChildProcess | null = null;
let currentWorkers: Worker[] = [];

const hasStressNg = (): boolean => {
    const cmd = process.platform === "win32" ? "where stress-ng" : "which stress-ng";
    try {
        execSync(cmd, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
};

const runCpuStressWithStressNg = (
    percentage: number,
    durationSeconds: number,
    cpuCount: number
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const proc = spawn("stress-ng", [
            "--cpu", String(cpuCount),
            "--cpu-load", String(percentage),
            "--timeout", `${durationSeconds}s`,
            "--metrics-brief",
        ]);

        currentProcess = proc;

        // Check for cancellation every second
        const cancelCheck = setInterval(() => {
            if (isCancelled()) {
                clearInterval(cancelCheck);
                proc.kill('SIGTERM');
                console.log("CPU stress cancelled - terminating stress-ng");
            }
        }, 1000);

        proc.stdout.on("data", (d) =>
            console.log(`[stress-ng] ${d.toString().trim()}`)
        );
        proc.stderr.on("data", (d) =>
            console.log(`[stress-ng] ${d.toString().trim()}`)
        );

        proc.on("close", (code) => {
            clearInterval(cancelCheck);
            currentProcess = null;
            
            if (isCancelled()) {
                console.log("CPU stress cancelled and cleaned up");
                resolve();
            } else if (code === 0 || code === null) {
                console.log("CPU stress finished and cleaned up automatically");
                resolve();
            } else {
                reject(new Error(`stress-ng exited with code ${code}`));
            }
        });

        proc.on("error", (err) => {
            clearInterval(cancelCheck);
            currentProcess = null;
            reject(new Error(`Failed to start stress-ng: ${err.message}`));
        });
    });
};

const runCpuStressWithNodeWorkers = (
    percentage: number,
    durationSeconds: number,
    cpuCount: number
): Promise<void> => {
    const load = Math.max(1, Math.min(100, Math.floor(percentage)));
    const durationMs = Math.max(1, Math.floor(durationSeconds * 1000));

    return new Promise((resolve, reject) => {
        let remaining = cpuCount;
        let settled = false;
        const workers: Worker[] = [];

        // Check for cancellation every second
        const cancelCheck = setInterval(() => {
            if (isCancelled() && !settled) {
                clearInterval(cancelCheck);
                settled = true;
                console.log("CPU stress cancelled - terminating workers");
                workers.forEach(w => w.terminate());
                currentWorkers = [];
                resolve();
            }
        }, 1000);

        const workerSource = `
            const { parentPort, workerData } = require('worker_threads');
            const load = workerData.load;
            const end = Date.now() + workerData.durationMs;
            const spin = () => Math.sqrt(Math.random());
            const sleep = (ms) => {
                if (ms <= 0) return;
                const sab = new SharedArrayBuffer(4);
                const int32 = new Int32Array(sab);
                Atomics.wait(int32, 0, 0, ms);
            };
            const slice = 100;
            while (Date.now() < end) {
                const busyMs = Math.max(1, Math.floor(slice * (load / 100)));
                const stopBusy = Date.now() + busyMs;
                while (Date.now() < stopBusy) {
                    spin();
                }
                sleep(slice - busyMs);
            }
            parentPort.postMessage('done');
        `;

        for (let i = 0; i < cpuCount; i++) {
            const worker = new Worker(workerSource, {
                eval: true,
                workerData: { load, durationMs },
            });

            workers.push(worker);
            currentWorkers = workers;

            worker.on("error", (err: Error) => {
                if (!settled) {
                    clearInterval(cancelCheck);
                    settled = true;
                    workers.forEach(w => w.terminate());
                    currentWorkers = [];
                    reject(new Error(`Node CPU stress worker failed: ${err.message}`));
                }
            });

            worker.on("exit", () => {
                remaining -= 1;
                if (!settled && remaining === 0) {
                    clearInterval(cancelCheck);
                    settled = true;
                    currentWorkers = [];
                    console.log("CPU stress finished using Node worker fallback");
                    resolve();
                }
            });
        }
    });
};

export const runCpuStress = async (payload: CpuStressPayload): Promise<void> => {
    const { percentage, durationSeconds } = payload;
    const cpuCount = os.cpus().length;

    console.log(`\n CPU STRESS ATTACK`);
    console.log(` Load : ${percentage}%`);
    console.log(` Cores : ${cpuCount}`);
    console.log(` Duration: ${durationSeconds}s`);

    if (hasStressNg()) {
        await runCpuStressWithStressNg(percentage, durationSeconds, cpuCount);
        return;
    }

    console.warn("stress-ng not found. Using Node worker fallback CPU stress.");
    await runCpuStressWithNodeWorkers(percentage, durationSeconds, cpuCount);
};