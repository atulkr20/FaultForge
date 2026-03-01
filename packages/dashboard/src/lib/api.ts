import type { Agent, Attack, CreateAttackRequest } from "./types";

const BASE_URL = "http://localhost:3000";

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return parseJson<{ status: string; service: string; timestamp: string }>(res);
}

export async function getAgents() {
  const res = await fetch(`${BASE_URL}/api/agents`);
  return parseJson<Agent[]>(res);
}

export async function getAgentById(id: string) {
  const res = await fetch(`${BASE_URL}/api/agents/${id}`);
  return parseJson<Agent>(res);
}

export async function getAttacks(params?: { agentId?: string; status?: string }) {
  const search = new URLSearchParams();
  if (params?.agentId) search.set("agentId", params.agentId);
  if (params?.status) search.set("status", params.status);
  const q = search.toString();
  const res = await fetch(`${BASE_URL}/api/attacks${q ? `?${q}` : ""}`);
  return parseJson<Attack[]>(res);
}

export async function getAttackById(id: string) {
  const res = await fetch(`${BASE_URL}/api/attacks/${id}`);
  return parseJson<Attack>(res);
}

export async function createAttack(input: CreateAttackRequest) {
  const res = await fetch(`${BASE_URL}/api/attacks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return parseJson<Attack>(res);
}

export async function cancelAttack(id: string) {
  const res = await fetch(`${BASE_URL}/api/attacks/${id}/cancel`, {
    method: "POST",
  });
  return parseJson<Attack>(res);
}