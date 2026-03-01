import axios from 'axios';
import { AgentCommand, AttackReport, CpuStressPayload, NetworkLatencyPayload } from "@faultforge/shared";
import { runCpuStress } from "./weapons/cpu-stress";
import { runNetworkLatency } from "./weapons/network-latency";

const CONTROL_PANEL = process.env.CONTROL_PANEL_URL || "http://localhost:3000";

// Track cancellation state
let shouldCancel = false;
let currentAttackId: string | null = null;

export const cancelCurrentAttack = () => {
    shouldCancel = true;
};

export const isCancelled = () => shouldCancel;

export const executeCommand = async (
    command: AgentCommand,
    agentId: string
): Promise<void> => {
    // Reset cancellation state for new command
    shouldCancel = false;
    currentAttackId = command.commandId;

    try {
        // Route the command to the correct weapon based on type
        // Interfaces (takes a payload, returns a promise ) but does different things.
        switch (command.type) {
            case "CPU_STRESS":
                await runCpuStress(command.payload as CpuStressPayload);
                break;

                case "NETWORK_LATENCY":
                    await runNetworkLatency(command.payload as NetworkLatencyPayload);
                    break;
                    default:
                        throw new Error(`Unknown command type: ${command.type}`);
        }

        // Check if cancelled during execution
        if (shouldCancel) {
            await reportResult(command.commandId!, agentId, "CANCELLED", "Attack cancelled by user");
        } else {
            // Attack completed successfully - report back
            await reportResult(command.commandId!, agentId, "COMPLETED");
        }
    } catch (err:any) {
        console.error(`Attack failed: ${err.message}`);

        // Even on failure, we always report back to the control panel so that it doesn't get stuck on thinking the attack is still IN_PROGRESS
        await reportResult(command.commandId!, agentId, "FAILED", err.message);
    } finally {
        shouldCancel = false;
        currentAttackId = null;
    }
};

// Sends the result back to the control panel
const reportResult = async (
    commandId: string, 
    agentId: string, 
    status: Extract<AttackReport["status"], "COMPLETED" | "FAILED" | "CANCELLED">,
    message?: string
) => {
    const report: AttackReport = {
        commandId,
        agentId, 
        status,
        message,
        completedAt: new Date().toISOString(),
    };
    try {
        await axios.patch(
            `${CONTROL_PANEL}/api/attacks/${commandId}/report`,
            report,
            { timeout: 5000 }
        );
        console.log(`Reported status [${status}] to control panel`);
    } catch (err: any) {

        console.error(`Failed to report result: ${err.message}`);
    }
};