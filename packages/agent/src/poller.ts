import axios from 'axios';
import { AgentCommand, HeartbeatPayload } from "@faultforge/shared";
import { agentMeta } from "./index";
import { executeCommand, cancelCurrentAttack } from './executor';


const CONTROL_PANEL = process.env.CONTROL_PANEL_URL || "http://localhost:3000";

let isBusy = false;
let currentCommandId: string | null = null;

export const startPolling =(
    meta: typeof agentMeta,
    intervalMs: number
) => {
    console.log(`Polling control panel every ${intervalMs}ms...`);

    // Run immediately on start, the repeat on interval
    poll(meta);
    setInterval(() => poll(meta), intervalMs);
};

const poll = async (meta: typeof agentMeta) => {
    const payload: HeartbeatPayload ={
        ...meta,
        status: isBusy ? "BUSY" : "IDLE",
        currentCommandId,
    };

    try {
        const { data } = await axios.post<{ command: AgentCommand}> (
            `${CONTROL_PANEL}/api/agents/heartbeat`,
            payload, 
            {
                timeout: 5000, // Don't wait more than 5s for a response
            }
        );

        const command = data.command;

        // If busy, check if current attack was cancelled
        if (isBusy && currentCommandId) {
            try {
                const { data: attackData } = await axios.get(
                    `${CONTROL_PANEL}/api/attacks/${currentCommandId}`,
                    { timeout: 5000 }
                );
                if (attackData.status === "CANCELLED") {
                    console.log(`Attack [${currentCommandId}] was cancelled - stopping execution`);
                    cancelCurrentAttack();
                }
            } catch (err: any) {
                console.warn(`Failed to check attack status: ${err.message}`);
            }
        }

        if (command.type === "IDLE" || isBusy || !command.commandId) {
            return;
        }
        console.log(`\n Received:command: [${command.type}] ID: ${command.commandId}`)

        //Lock the agent so the next poll doesn't pick up another command
        isBusy = true;
        currentCommandId = command.commandId;

        // Execute the attack without blocking the poll loop.
        //.finally() always runs whether the attack succeeds or fails 
        executeCommand(command, meta.agentId).finally(() => {
            isBusy = false;
            currentCommandId = null;
            console.log(`Agent is IDLE - ready for next command\n`);
        });
    } catch (err: any) {
        // Don't crash the agent if the control panel is temporarily down
        // Just log and  try again next interval

        if(err.code === "ECONNREFUSED"){
            console.warn(" Control panel is unreachable - will retry...");
        } else {
            console.warn(`Poll error: ${err.message}`);
        }
    }
};