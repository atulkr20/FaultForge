import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle, Clock4, Network, Shield } from "lucide-react";
import { createAttack, getAgentById, getAttacks, getTargets } from "@/lib/api";
import type { Attack, AttackType, CreateAttackRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import AttackTypeIconLabel from "@/components/AttackTypeIconLabel";

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
    return <div className="text-text-muted">Loading agent dossier...</div>;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardDescription>Agent Dossier</CardDescription>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-2xl">{agent.hostname}</CardTitle>
              <StatusBadge status={agent.status} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-2">
            <div className="rounded-md border border-border bg-bg/60 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Identity</p>
              <p className="mt-1 font-mono text-xs text-text-primary">{agent.id}</p>
            </div>
            <div className="rounded-md border border-border bg-bg/60 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Network</p>
              <p className="mt-1 text-text-primary">{agent.ipAddress}</p>
            </div>
            <div className="rounded-md border border-border bg-bg/60 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Platform</p>
              <p className="mt-1 text-text-primary">{agent.platform}/{agent.arch}</p>
            </div>
            <div className="rounded-md border border-border bg-bg/60 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Registered</p>
              <p className="mt-1 text-text-primary">{formatDate(agent.registeredAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Execution Timeline</CardDescription>
            <CardTitle>Attack History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sortedAttacks.map((attack) => (
              <div key={attack.id} className="rounded-md border border-border bg-bg/60 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AttackTypeIconLabel type={attack.type} />
                    <StatusBadge status={attack.status} />
                  </div>
                  <p className="inline-flex items-center gap-1 text-xs text-text-muted">
                    <Clock4 className="h-3.5 w-3.5" />
                    {formatDate(attack.scheduledAt)}
                  </p>
                </div>
                {attack.errorMessage && <p className="mt-2 text-xs text-danger">{attack.errorMessage}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit xl:sticky xl:top-20">
        <CardHeader>
          <CardDescription>Operation Console</CardDescription>
          <CardTitle>Launch Attack</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Attack Type</p>
            <Select value={attackType} onChange={(e) => setAttackType(e.target.value as AttackType)}>
              <option value="CPU_STRESS">CPU_STRESS</option>
              <option value="NETWORK_LATENCY">NETWORK_LATENCY</option>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Linked Target</p>
            <Select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
              <option value="">No target</option>
              {targets.map((target) => (
                <option key={target.id} value={target.id}>
                  {target.name} ({target.baseUrl})
                </option>
              ))}
            </Select>
          </div>

          {attackType === "CPU_STRESS" ? (
            <>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">CPU Load {percentage}%</p>
                <input type="range" min={0} max={100} value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} className="w-full accent-warning" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Duration (seconds)</p>
                <Input type="number" value={cpuDuration} min={1} onChange={(e) => setCpuDuration(Number(e.target.value))} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <p className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] text-text-muted">
                  <Network className="h-3.5 w-3.5" />
                  Interface
                </p>
                <Input value={iface} onChange={(e) => setIface(e.target.value)} placeholder="eth0" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Latency {latency} ms</p>
                <input type="range" min={0} max={500} value={latency} onChange={(e) => setLatency(Number(e.target.value))} className="w-full accent-warning" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Duration (seconds)</p>
                <Input type="number" value={netDuration} min={1} onChange={(e) => setNetDuration(Number(e.target.value))} />
              </div>
            </>
          )}

          <Button variant="danger" className="w-full" onClick={submitAttack} disabled={mutation.isPending}>
            <AlertTriangle className="h-4 w-4" />
            Execute Attack
          </Button>

          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-bg/60 px-3 py-2 text-xs text-text-muted">
            <Shield className="h-3.5 w-3.5 text-warning" />
            Commands are dispatched on next heartbeat.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
