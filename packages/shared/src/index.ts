// This file defines the language that the control panel and agent use to talk to each other

// What the Agent tells the Control panel 
export interface HeartbeatPayload {
    agentId: string;
    hostname: string;
    ipAddress: string;
    platform: string,
    arch: string,
    version: string,
    status: "IDLE" | "BUSY";
    currentCommandId: string | null;
}

// what the control panel sends back to the Agent
export interface AgentCommand {
    commandId: string | null;
    type: "IDLE" | "CPU_STRESS" | "Network LATENCY";
    payload: CpuStressPayload | NetworkLatencyPayload | null;
}

// Payload shapes each attack type
export interface CpuStressPayload {
    percentage: number;
    durationSeconds: number;
}

export interface NetworkLatencyPayload {
    interface: string;
    latencyMs: number;
    durationSeconds: number;
}

// The agent reports back after finishing
export interface AttackReport {
    commandId : string;
    agentId: string;
    status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
    completedAt?: string;
}