import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Activity, Bomb, Cpu, Server, ShieldCheck, Timer } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { getAgents, getAttacks } from "@/lib/api";
import { calculateDuration, formatDate } from "@/lib/utils";
import type { Attack } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import AttackTypeIconLabel from "@/components/AttackTypeIconLabel";
import { useRelativeTime } from "@/hooks/useRelativeTime";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
    refetchInterval: 5000,
  });

  const { data: attacks = [] } = useQuery({
    queryKey: ["attacks", "recent"],
    queryFn: () => getAttacks(),
    refetchInterval: 5000,
  });

  const stats = useMemo(() => {
    const online = agents.filter((a) => a.status !== "OFFLINE").length;
    const active = attacks.filter((a) => a.status === "IN_PROGRESS" || a.status === "PENDING").length;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const today = attacks.filter((a) => new Date(a.scheduledAt) >= startOfDay).length;

    const terminal = attacks.filter((a) => a.status === "COMPLETED" || a.status === "FAILED");
    const completed = terminal.filter((a) => a.status === "COMPLETED").length;
    const successRate = terminal.length ? Math.round((completed / terminal.length) * 100) : 0;

    return { online, active, today, successRate };
  }, [agents, attacks]);

  const chartData = useMemo(() => {
    const slots = [5, 4, 3, 2, 1, 0];
    return slots.map((offset) => {
      const d = new Date();
      d.setHours(d.getHours() - offset);
      const hour = d.getHours();
      const count = attacks.filter((a) => new Date(a.scheduledAt).getHours() === hour).length;
      return { hour: `${hour}:00`, attacks: count };
    });
  }, [attacks]);

  const recent = [...attacks].sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt)).slice(0, 10);
  const fleet = [...agents].slice(0, 8);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardDescription>Mission Overview</CardDescription>
            <CardTitle className="text-2xl">Operational Command Board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="max-w-2xl text-sm text-text-muted">
              This console monitors live blast radius, fleet availability, and execution quality. Use it to control
              failures with precision, not guesswork.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-border bg-bg/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Fleet Online</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-text-primary">
                  <Server className="h-4 w-4 text-warning" /> {stats.online}/{agents.length}
                </p>
              </div>
              <div className="rounded-md border border-border bg-bg/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Active Operations</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-text-primary">
                  <Bomb className="h-4 w-4 text-warning" /> {stats.active}
                </p>
              </div>
              <div className="rounded-md border border-border bg-bg/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Runs Today</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-text-primary">
                  <Activity className="h-4 w-4 text-warning" /> {stats.today}
                </p>
              </div>
              <div className="rounded-md border border-border bg-bg/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Success Ratio</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-text-primary">
                  <ShieldCheck className="h-4 w-4 text-warning" /> {stats.successRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Telemetry</CardDescription>
            <CardTitle>Attack Throughput</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="attackFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d3a957" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#d3a957" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ background: "#111418", border: "1px solid #252a31", borderRadius: 8 }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Area type="monotone" dataKey="attacks" stroke="#d3a957" fill="url(#attackFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section id="agents" className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
        <Card>
          <CardHeader>
            <CardDescription>Fleet Matrix</CardDescription>
            <CardTitle>Agent Readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {fleet.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-bg/60 p-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{agent.hostname}</p>
                  <p className="text-xs text-text-muted">{agent.ipAddress}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={agent.status} />
                  <Button size="sm" variant="outline" onClick={() => navigate(`/agents/${agent.id}`)}>
                    Engage
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Execution Feed</CardDescription>
            <CardTitle>Recent Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Logged</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((attack: Attack) => (
                  <TableRow key={attack.id}>
                    <TableCell><AttackTypeIconLabel type={attack.type} /></TableCell>
                    <TableCell>{attack.agent?.hostname ?? attack.agentId.slice(0, 8)}</TableCell>
                    <TableCell><StatusBadge status={attack.status} /></TableCell>
                    <TableCell>{calculateDuration(attack.startedAt, attack.completedAt)}</TableCell>
                    <TableCell className="text-text-muted">{formatDate(attack.scheduledAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardDescription>Signal Monitor</CardDescription>
          <CardTitle>Fleet Last Seen</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {agents.slice(0, 8).map((agent) => (
            <LastSeenTile key={agent.id} hostname={agent.hostname} lastSeenAt={agent.lastSeenAt} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function LastSeenTile({ hostname, lastSeenAt }: { hostname: string; lastSeenAt: string }) {
  const relativeTime = useRelativeTime(lastSeenAt);

  return (
    <div className="rounded-md border border-border bg-bg/60 p-3">
      <p className="truncate text-sm font-semibold text-text-primary">{hostname}</p>
      <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-muted">
        <Timer className="h-3.5 w-3.5" />
        {relativeTime}
      </p>
      <p className="mt-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] text-warning">
        <Cpu className="h-3.5 w-3.5" />
        Telemetry Active
      </p>
    </div>
  );
}
