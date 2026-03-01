export type AgentStatus = "IDLE" | "BUSY" | "OFFLINE";
export type AttackStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELLED";
export type AttackType = "CPU_STRESS" | "NETWORK_LATENCY";

export interface Attack {
  id: string;
  agentId: string;
  type: AttackType;
  payload: Record<string, unknown>;
  status: AttackStatus;
  scheduledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  agent?: Agent;
}

export interface Agent {
  id: string;
  hostname: string;
  ipAddress: string;
  platform: string;
  arch: string;
  version: string;
  status: AgentStatus;
  lastSeenAt: string;
  registeredAt: string;
  attacks?: Attack[];
  isOnline?: boolean;
}

export interface CreateAttackRequest {
  agentId: string;
  type: AttackType;
  payload: Record<string, unknown>;
}