import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAgents, getAttacks } from "@/lib/api";
import {
  Activity,
  CheckCircle2,
  Database,
  FlaskConical,
  Globe,
  Server,
  TriangleAlert,
  Wifi,
  Zap,
} from "lucide-react";

type SparklineProps = {
  points: number[];
  stroke?: string;
};

function Sparkline({ points, stroke = "#ff3c3c" }: SparklineProps) {
  const width = 300;
  const height = 70;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 1);

  const line = points
    .map((value, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_10px_rgba(255,60,60,0.55)]"
      />
    </svg>
  );
}

export default function OverviewPage() {
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
    const total = attacks.length;
    const passed = attacks.filter((a) => a.status === "COMPLETED").length;
    const failed = attacks.filter((a) => a.status === "FAILED").length;
    const active = attacks.filter((a) => a.status === "IN_PROGRESS" || a.status === "PENDING").length;
    return { total, passed, failed, active };
  }, [attacks]);

  const infraNodes = [
    { id: "gw1", name: "api-gw-01", icon: Globe, status: "OK" as const },
    { id: "gw2", name: "api-gw-02", icon: Globe, status: "OK" as const },
    { id: "n1", name: "node-01", icon: Server, status: "OK" as const },
    { id: "n2", name: "node-02", icon: Server, status: "OK" as const },
    { id: "db1", name: "db-primary", icon: Database, status: "OK" as const },
    { id: "db2", name: "db-replica", icon: Database, status: "DEGRADED" as const },
  ];

  const cpuTrend = [42, 58, 46, 57, 59, 41, 44, 37, 39, 48, 61, 53, 35, 62, 64, 34, 52, 52, 39];
  const latencyTrend = [11, 11, 10, 16, 14, 11, 16, 12, 15, 13, 15, 11, 12, 16, 12, 16, 16, 13];

  const statCards = [
    {
      key: "total",
      label: "TOTAL RUNS",
      value: stats.total,
      helper: "All time experiments",
      icon: FlaskConical,
      accent: "border-t-[#b4333a]",
      iconClass: "text-[#ff4f57]",
    },
    {
      key: "passed",
      label: "PASSED",
      value: stats.passed,
      helper: "Completed successfully",
      icon: CheckCircle2,
      accent: "border-t-[#00a38a]",
      iconClass: "text-[#ff4f57]",
    },
    {
      key: "failed",
      label: "FAILED",
      value: stats.failed,
      helper: "Aborted or errored",
      icon: TriangleAlert,
      accent: "border-t-[#b96d1e]",
      iconClass: "text-[#ff4f57]",
    },
    {
      key: "active",
      label: "ACTIVE NOW",
      value: stats.active,
      helper: "Live injections",
      icon: Activity,
      accent: "border-t-[#b4333a]",
      iconClass: "text-[#ff4f57]",
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-[2.05rem] text-[#f2f3f4] font-semibold tracking-tight">Chaos Dashboard</h1>
        <p className="mt-1 text-[0.95rem] text-[#6e737b] tracking-tight">
          Monitor, configure, and launch fault injection experiments.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.key}
              className={`border border-white/10 ${card.accent} rounded-md bg-[#07090d] p-6 min-h-[145px]`}
            >
              <div className="flex items-start justify-between">
                <p className="text-[0.9rem] text-[#6f757f] tracking-[0.16em]">{card.label}</p>
                <span className="w-10 h-10 rounded-md border border-[#ff3c3c]/20 bg-[#260b11] flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${card.iconClass}`} />
                </span>
              </div>
              <p className="mt-2 text-[3rem] leading-none text-[#eef0f1] font-semibold">{card.value}</p>
              <p className="mt-2 text-[0.95rem] text-[#5f646d]">{card.helper}</p>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article className="border border-white/10 rounded-md bg-[#07090d] p-6 min-h-[178px]">
          <div className="flex h-full items-center justify-between gap-8">
            <div className="min-w-[180px]">
              <div className="flex items-center gap-2 text-[#ff4d53]">
                <Activity className="w-4 h-4" />
                <span className="text-[0.9rem] tracking-[0.16em] text-[#6f757f]">CPU LOAD</span>
              </div>
              <p className="mt-2 text-[3rem] text-[#f0f1f2] leading-none font-semibold">16.4%</p>
              <p className="mt-1 text-[0.95rem] text-[#5f646d]">baseline</p>
            </div>
            <div className="h-20 w-full max-w-[300px]">
              <Sparkline points={cpuTrend} />
            </div>
          </div>
        </article>

        <article className="border border-white/10 rounded-md bg-[#07090d] p-6 min-h-[178px]">
          <div className="flex h-full items-center justify-between gap-8">
            <div className="min-w-[180px]">
              <div className="flex items-center gap-2 text-[#ff4d53]">
                <Wifi className="w-4 h-4" />
                <span className="text-[0.9rem] tracking-[0.16em] text-[#6f757f]">NET LATENCY</span>
              </div>
              <p className="mt-2 text-[3rem] text-[#f0f1f2] leading-none font-semibold">13ms</p>
              <p className="mt-1 text-[0.95rem] text-[#5f646d]">baseline</p>
            </div>
            <div className="h-20 w-full max-w-[300px]">
              <Sparkline points={latencyTrend} />
            </div>
          </div>
        </article>
      </section>

      <section className="border border-white/10 rounded-md bg-[#07090d] p-6">
        <div className="flex items-center gap-2 text-[#ff4d53]">
          <Server className="w-4 h-4" />
          <h2 className="text-[0.9rem] tracking-[0.16em] text-[#6f757f]">TARGET INFRASTRUCTURE</h2>
        </div>

        <div className="mt-10 flex flex-wrap items-start justify-center gap-8 xl:gap-10">
          {infraNodes.map((node) => {
            const Icon = node.icon;
            const degraded = node.status === "DEGRADED";
            return (
              <div key={node.id} className="w-[90px] text-center">
                <div
                  className={`mx-auto w-14 h-14 rounded-md border flex items-center justify-center ${
                    degraded
                      ? "bg-[#2d1d08] border-[#d08122]/60 text-[#f29c2f]"
                      : "bg-[#12141a] border-white/10 text-[#5f646d]"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p className="mt-3 text-[0.85rem] text-[#5f646d]">{node.name}</p>
                <p className={`mt-2 text-[0.86rem] font-semibold ${degraded ? "text-[#f2a13a]" : "text-[#00d88d]"}`}>
                  {node.status}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pt-1 pb-2">
        <div className="inline-flex items-center gap-3">
          <Zap className="w-4 h-4 text-[#ff3c3c]" />
          <span className="text-[#6f757f] tracking-[0.2em]">CHAOS AGENTS</span>
          <span className="px-3 py-1 border border-[#ff3c3c]/25 bg-[#2a0b10] text-[#8b6568] text-[0.82rem] rounded-sm">
            {agents.length} registered
          </span>
        </div>
      </section>
    </div>
  );
}
