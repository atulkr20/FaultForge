import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowUpRight, Bomb, Server, Shield, ShieldCheck, Zap } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { getAgents, getAttacks } from "@/lib/api";
import { calculateDuration, formatDate } from "@/lib/utils";
import type { Agent, Attack } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import AttackTypeIconLabel from "@/components/AttackTypeIconLabel";
import { useRelativeTime } from "@/hooks/useRelativeTime";

function StatCard({
  title,
  value,
  subtitle,
  icon,
  pulse,
}: {
  title: string;
  value: string | number;
  subtitle: React.ReactNode;
  icon: React.ReactNode;
  pulse?: boolean;
}) {
  return (
    <Card className="border-l-2 border-l-primary hover:shadow-glow">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardDescription>{title}</CardDescription>
        <div className="text-text-muted">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-3xl font-bold">
          {value}
          {pulse && <span className="h-2.5 w-2.5 rounded-full bg-danger animate-pulseSlow" />}
        </div>
        <div className="mt-1 text-xs text-text-muted">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const navigate = useNavigate();
  const relativeTime = useRelativeTime(agent.lastSeenAt);

  return (
    <Card className="hover:shadow-glow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{agent.hostname}</CardTitle>
          <StatusBadge status={agent.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-text-muted">
        <p>
          IP: <span className="font-mono text-text-primary">{agent.ipAddress}</span>
        </p>
        <p>
          Platform: <span className="text-text-primary">{agent.platform}/{agent.arch}</span>
        </p>
        <p>Last seen: {relativeTime}</p>
        <Button variant="outline" className="mt-2 w-full" onClick={() => navigate(`/agents/${agent.id}`)}>
          Launch Attack
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
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

  const recent = [...attacks].sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt)).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/80 p-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="rounded-md bg-primary/20 p-1 text-primary"><Zap className="h-4 w-4" /></span>
          <span className="rounded-md bg-border p-1 text-text-muted"><Shield className="h-4 w-4" /></span>
          FaultForge
          <span className="text-xs text-text-muted">/ dashboard</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <a href="/dashboard" className="hover:text-text-primary">Dashboard</a>
          <span>•</span>
          <a href="/attacks" className="hover:text-text-primary">Attacks</a>
          <span>•</span>
          <a href="/settings" className="hover:text-text-primary">Settings</a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Agents"
          value={agents.length}
          subtitle={<span>{stats.online} online</span>}
          icon={<Server className="h-4 w-4" />}
        />
        <StatCard
          title="Active Attacks"
          value={stats.active}
          subtitle="Pending + in progress"
          icon={<Bomb className="h-4 w-4" />}
          pulse={stats.active > 0}
        />
        <StatCard
          title="Attacks Today"
          value={stats.today}
          subtitle="Since 00:00"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          subtitle={<span className="inline-flex items-center gap-1 text-success"><ArrowUpRight className="h-3 w-3" /> stable trend</span>}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attack Throughput</CardTitle>
          <CardDescription>Recent hourly attack volume</CardDescription>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="attackFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10 }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Area type="monotone" dataKey="attacks" stroke="#7c3aed" fill="url(#attackFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <section id="agents" className="space-y-3">
        <h2 className="text-lg font-semibold">Agent Fleet</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attacks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attack Type</TableHead>
                <TableHead>Target Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Timestamp</TableHead>
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
    </div>
  );
}