import { execSync } from "child_process";
import { NetworkLatencyPayload } from "@faultforge/shared";

// Helper to run tc (traffic control) commands
// sudo is required because tc modifies kernel network settings

const tc = (args: string): void => {
    execSync(`sudo tc ${args}`, { stdio: "pipe" });
};

const hasTc = (): boolean => {
    const cmd = process.platform === "win32" ? "where tc" : "which tc";
    try {
        execSync(cmd, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
};

export const runNetworkLatency = async (
    payload: NetworkLatencyPayload
): Promise<void> => {
    const { interface: iface, latencyMs, durationSeconds } = payload;

    console.log(`\n NETWORK LATENCY ATTACKED`);
    console.log(` INterface: ${iface}`);
    console.log(` Latency : +${latencyMs}ms`);
    console.log(` Duration : ${durationSeconds}s`);

    if (!hasTc()) {
        console.warn("tc not found on this OS. Using simulated network latency fallback.");
        await sleep(durationSeconds * 1000);
        console.log(`Simulated network latency completed after ${durationSeconds}s`);
        return;
    }

    // If a previos attack failed mid-cleanup, there might be leftover rules.
    // we ignore errors here because there might be nothing to delete.

    try {
        tc(`qdisc del dev ${iface} root`);
        console.log("Cleared existing to rules");
    } catch {
        // Nothig to clean
    }

    // Add the latency rule using netem (Network Emulator)
    // netem is a linux kernel module specifically for network simulation
    // "qdisc" = queueing discipline - controls how packets are queued/delayed

    tc(`qdisc add dev ${iface} root netem delay ${latencyMs}ms`);
    console.log(`Latency injected: all packets on ${iface} delayed by ${latencyMs}ms`)

    // wait for the attack duration
    await sleep(durationSeconds * 1000);

    // self-healing -- remove the rules after the duration expires
    // this always runs because it's after the await, not in a .then()

    try {
        tc(`qdisc del dev ${iface} root`);
        console.log(`Network latency removed from ${iface} - interface restored`);
    } catch (err: any) {
        console.warn(`Cleanup warning (may already be clean): ${err.message} `);
    }
};
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));