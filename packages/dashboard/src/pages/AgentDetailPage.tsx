import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { createAttack, getAgentById, getAttacks } from "@/lib/api";
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
      toast.success("Attack scheduled", { description: "The agent will pick this command on next heartbeat." });
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
      type: attackType,
      payload,
    });
  };

  if (!agent) {
    return <div className="text-text-muted">Loading agent details...</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl">{agent.hostname}</CardTitle>
                <CardDescription className="font-mono">{agent.id}</CardDescription>
              </div>
              <StatusBadge status={agent.status} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-text-muted md:grid-cols-2">
            <div>IP: <span className="font-mono text-text-primary">{agent.ipAddress}</span></div>
            <div>Platform: <span className="text-text-primary">{agent.platform}/{agent.arch}</span></div>
            <div>Version: <span className="text-text-primary">{agent.version}</span></div>
            <div>Registered: <span className="text-text-primary">{formatDate(agent.registeredAt)}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attack History Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative ml-2 space-y-5 border-l border-border pl-6">
              {sortedAttacks.map((attack) => (
                <div key={attack.id} className="relative">
                  <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary" />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <AttackTypeIconLabel type={attack.type} />
                      <StatusBadge status={attack.status} />
                    </div>
                    <p className="text-xs text-text-muted">{formatDate(attack.scheduledAt)}</p>
                    {attack.errorMessage && <p className="text-xs text-danger">{attack.errorMessage}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit xl:sticky xl:top-4">
        <CardHeader>
          <CardTitle>Launch Attack</CardTitle>
          <CardDescription>Use with caution in live environments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-text-muted">Attack Type</label>
            <Select value={attackType} onChange={(e) => setAttackType(e.target.value as AttackType)}>
              <option value="CPU_STRESS">CPU_STRESS</option>
              <option value="NETWORK_LATENCY">NETWORK_LATENCY</option>
            </Select>
          </div>

          {attackType === "CPU_STRESS" ? (
            <>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">CPU Percentage: {percentage}%</label>
                <input type="range" min={0} max={100} value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} className="w-full accent-danger" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Duration (seconds)</label>
                <Input type="number" value={cpuDuration} min={1} onChange={(e) => setCpuDuration(Number(e.target.value))} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Interface</label>
                <Input value={iface} onChange={(e) => setIface(e.target.value)} placeholder="eth0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Latency: {latency} ms</label>
                <input type="range" min={0} max={500} value={latency} onChange={(e) => setLatency(Number(e.target.value))} className="w-full accent-warning" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Duration (seconds)</label>
                <Input type="number" value={netDuration} min={1} onChange={(e) => setNetDuration(Number(e.target.value))} />
              </div>
            </>
          )}

          <Button variant="danger" className="w-full" onClick={submitAttack} disabled={mutation.isPending}>
            <AlertTriangle className="h-4 w-4" />
            EXECUTE ATTACK
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}