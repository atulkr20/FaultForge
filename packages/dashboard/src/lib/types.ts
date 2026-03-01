export type AgentStatus = "IDLE" | "BUSY" | "OFFLINE";
export type AttackStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELLED";
export type AttackType = "CPU_STRESS" | "NETWORK_LATENCY";

export interface Attack {
  id: string;
  agentId: string;
  targetId?: string | null;
  type: AttackType;
  payload: Record<string, unknown>;
  status: AttackStatus;
  scheduledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  agent?: Agent;
  target?: Target;
}

export interface Target {
  id: string;
  name: string;
  baseUrl: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
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
  targetId?: string;
  type: AttackType;
  payload: Record<string, unknown>;
}

export interface CreateTargetRequest {
  name: string;
  baseUrl: string;
  description?: string;
}