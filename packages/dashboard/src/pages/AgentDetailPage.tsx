import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { createAttack, getAgentById, getAttacks, getTargets } from "@/lib/api";
import type { Attack, AttackType, CreateAttackRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export default function AgentDetailPage() {
  const { id = "" } = useParams();
  const queryClient = useQueryClient();

  const [attackType, setAttackType] = useState<AttackType>("CPU_STRESS");
  const [percentage, setPercentage] = useState(80);
  const [cpuDuration, setCpuDuration] = useState(20);
  const [iface, setIface] = useState("eth0");
  const [latency, setLatency] = useState(120);
  const [netDuration, setNetDuration] = useState(20);
  const [targetId, setTargetId] = useState<string>("");
  const [expandedAttackId, setExpandedAttackId] = useState<string | null>(null);

  const { data: agent } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => getAgentById(id),
    enabled: Boolean(id),
    refetchInterval: 5000,
  });

  const { data: attacks = [] } = useQuery({
    queryKey: ["attacks", "agent", id],
    queryFn: () => getAttacks({ agentId: id }),
    enabled: Boolean(id),
    refetchInterval: 5000,
  });

  const { data: targets = [] } = useQuery({
    queryKey: ["targets"],
    queryFn: getTargets,
    refetchInterval: 10000,
  });

  const sortedAttacks = useMemo(
    () => [...attacks].sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt)),
    [attacks]
  );

  const mutation = useMutation({
    mutationFn: (payload: CreateAttackRequest) => createAttack(payload),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["attacks", "agent", id] });
      const prev = queryClient.getQueryData<Attack[]>(["attacks", "agent", id]) || [];
      const optimistic: Attack = {
        id: `optimistic-${Date.now()}`,
        agentId: input.agentId,
        type: input.type,
        payload: input.payload,
        status: "PENDING",
        scheduledAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        errorMessage: null,
      };
      queryClient.setQueryData<Attack[]>(["attacks", "agent", id], [optimistic, ...prev]);
      return { prev };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["attacks", "agent", id], ctx.prev);
      toast.error("Attack scheduling failed", { description: String(error) });
    },
    onSuccess: () => {
      toast.success("Attack scheduled", { description: "Agent will pick this command on next heartbeat." });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["attacks", "agent", id] });
      queryClient.invalidateQueries({ queryKey: ["attacks", "recent"] });
    },
  });

  const submitAttack = () => {
    if (!agent?.id) return;

    const payload =
      attackType === "CPU_STRESS"
        ? { percentage, durationSeconds: cpuDuration }
        : { interface: iface, latencyMs: latency, durationSeconds: netDuration };

    mutation.mutate({
      agentId: agent.id,
      targetId: targetId || undefined,
      type: attackType,
      payload,
    });
  };

  if (!agent) {
    return <div className="text-text-muted">Loading agent details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Agent Overview */}
      <section className="p-6 bg-card border border-white/5 rounded-lg">
        <h2 className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">Agent Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-text-muted text-xs mb-1">Hostname</p>
            <p className="text-3xl font-extrabold text-text-primary">{agent.hostname}</p>
          </div>
          
          <div>
            <p className="text-text-muted text-xs mb-1">Status</p>
            <p className={`text-3xl font-extrabold ${agent.status !== "OFFLINE" ? "text-success" : "text-danger"}`}>
              {agent.status !== "OFFLINE" ? "● Online" : "● Offline"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
          <div>
            <p className="text-text-muted text-xs mb-1">IP Address</p>
            <p className="font-mono text-sm text-text-primary">{agent.ipAddress}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Platform</p>
            <p className="text-sm text-text-primary">{agent.platform}/{agent.arch}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Version</p>
            <p className="text-sm text-text-primary">{agent.version}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Registered</p>
            <p className="text-sm text-text-primary">{formatDate(agent.registeredAt)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Launch Attack */}
        <section className="lg:col-span-1 p-6 bg-card border border-white/5 rounded-lg h-fit">
          <h2 className="text-xs font-mono text-danger tracking-widest mb-4 uppercase">Launch Attack</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2">Attack Type</label>
              <Select value={attackType} onChange={(e) => setAttackType(e.target.value as AttackType)}>
                <option value="CPU_STRESS">CPU Stress</option>
                <option value="NETWORK_LATENCY">Network Latency</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-2">Target (Optional)</label>
              <Select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
                <option value="">No target</option>
                {targets.map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.name}
                  </option>
                ))}
              </Select>
            </div>

            {attackType === "CPU_STRESS" ? (
              <>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-xs font-medium text-text-muted">CPU Load</label>
                    <span className="text-sm font-bold text-text-primary">{percentage}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">Duration (seconds)</label>
                  <Input type="number" value={cpuDuration} min={1} onChange={(e) => setCpuDuration(Number(e.target.value))} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">Interface</label>
                  <Input value={iface} onChange={(e) => setIface(e.target.value)} placeholder="eth0" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-xs font-medium text-text-muted">Latency</label>
                    <span className="text-sm font-bold text-text-primary">{latency}ms</span>
                  </div>
                  <input type="range" min={0} max={500} value={latency} onChange={(e) => setLatency(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">Duration (seconds)</label>
                  <Input type="number" value={netDuration} min={1} onChange={(e) => setNetDuration(Number(e.target.value))} />
                </div>
              </>
            )}

            <Button className="w-full" variant="danger" onClick={submitAttack} disabled={mutation.isPending}>
              Execute Attack
            </Button>
          </div>
        </section>

        {/* Attack History */}
        <section className="lg:col-span-2 p-6 bg-card border border-white/5 rounded-lg">
          <h2 className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">Attack History</h2>
          
          {sortedAttacks.length === 0 ? (
            <p className="text-text-muted text-sm">No attacks executed yet</p>
          ) : (
            <div className="space-y-3">
              {sortedAttacks.map((attack) => (
                <div 
                  key={attack.id}
                  onClick={() => setExpandedAttackId(expandedAttackId === attack.id ? null : attack.id)}
                  className="p-4 bg-bg rounded border border-white/5 cursor-pointer hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-bold text-text-primary uppercase text-sm">{attack.type}</div>
                      <div className="text-xs text-text-muted mt-1">{formatDate(attack.scheduledAt)}</div>
                    </div>
                    <div className="text-xs font-bold ml-4">
                      {attack.status === "IN_PROGRESS" ? (
                        <span className="text-warning animate-pulse">⚡ Running</span>
                      ) : attack.status === "PENDING" ? (
                        <span className="text-warning">⏳ Pending</span>
                      ) : attack.status === "COMPLETED" ? (
                        <span className="text-success">✓ Done</span>
                      ) : attack.status === "FAILED" ? (
                        <span className="text-danger">✗ Failed</span>
                      ) : (
                        <span className="text-text-muted">{attack.status}</span>
                      )}
                    </div>
                  </div>

                  {expandedAttackId === attack.id && (
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-xs">
                      <div>
                        <p className="text-text-muted mb-1 uppercase">Configuration</p>
                        <pre className="bg-bg/50 p-2 rounded text-text-muted overflow-auto max-h-32 border border-white/5">
                          {JSON.stringify(attack.payload, null, 2)}
                        </pre>
                      </div>
                      {attack.errorMessage && (
                        <p className="text-danger">{attack.errorMessage}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
