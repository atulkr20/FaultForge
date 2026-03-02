import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAgents, getAttacks } from "@/lib/api";
import { calculateDuration, formatDate } from "@/lib/utils";
import type { Attack } from "@/lib/types";
import { useRelativeTime } from "@/hooks/useRelativeTime";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

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

  const recent = [...attacks].sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt)).slice(0, 20);
  const activeOps = recent.filter((a) => a.status === "IN_PROGRESS" || a.status === "PENDING");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Main Metrics - HUGE */}
      <section 
        onClick={() => toggleSection("overview")}
        className="p-8 bg-card border border-white/5 rounded-lg cursor-pointer hover:border-white/10 transition-all"
      >
        <h2 className="text-xs font-mono text-primary tracking-widest mb-6 uppercase">System Status</h2>
        
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="text-text-muted text-xs mb-3">Agents Ready</p>
            <p className="text-5xl md:text-6xl font-extrabold text-primary">
              {stats.online}
              <span className="text-2xl text-text-muted">/{agents.length}</span>
            </p>
          </div>

          <div>
            <p className="text-text-muted text-xs mb-3">Active Operations</p>
            <p className="text-5xl md:text-6xl font-extrabold text-warning">{stats.active}</p>
          </div>

          <div>
            <p className="text-text-muted text-xs mb-3">Runs Today</p>
            <p className="text-5xl md:text-6xl font-extrabold text-text-primary">{stats.today}</p>
          </div>

          <div>
            <p className="text-text-muted text-xs mb-3">Success Rate</p>
            <p className="text-5xl md:text-6xl font-extrabold text-success">{stats.successRate}%</p>
          </div>
        </div>

        {expandedSection === "overview" && (
          <div className="mt-8 pt-8 border-t border-white/5 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Last Hour Executions</span>
              <span className="text-primary font-semibold">{activeOps.length} running</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Total Agents</span>
              <span className="text-text-primary font-semibold">{agents.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Total Operations</span>
              <span className="text-text-primary font-semibold">{attacks.length}</span>
            </div>
          </div>
        )}
      </section>

      {/* Active Operations */}
      {activeOps.length > 0 && (
        <section 
          onClick={() => toggleSection("active")}
          className="p-8 bg-card border border-white/5 rounded-lg cursor-pointer hover:border-white/10 transition-all"
        >
          <h2 className="text-xs font-mono text-warning tracking-widest mb-4 uppercase">Running Now</h2>
          <div className="space-y-3">
            {activeOps.map((attack) => (
              <div key={attack.id} className="p-4 bg-bg rounded border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-primary">{attack.agent?.hostname || attack.agentId.slice(0, 8)}</p>
                    <p className="text-xs text-text-muted uppercase">{attack.type}</p>
                  </div>
                  <span className="text-warning text-xs font-bold animate-pulse">● Running</span>
                </div>
                {expandedSection === "active" && (
                  <p className="text-xs text-text-muted mt-2">Started: {formatDate(attack.scheduledAt)}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Agents Grid */}
      <section 
        onClick={() => toggleSection("agents")}
        className="p-8 bg-card border border-white/5 rounded-lg cursor-pointer hover:border-white/10 transition-all"
      >
        <h2 className="text-xs font-mono text-primary tracking-widest mb-6 uppercase">Your Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.slice(0, 12).map((agent) => (
            <div 
              key={agent.id}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/agents/${agent.id}`);
              }}
              className="p-4 bg-bg rounded border border-white/5 cursor-pointer hover:border-white/10 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-text-primary">{agent.hostname}</p>
                  <p className="text-xs text-text-muted">{agent.ipAddress}</p>
                </div>
                <span className={agent.status !== "OFFLINE" ? "text-success text-sm" : "text-danger text-sm"}>
                  {agent.status !== "OFFLINE" ? "● Online" : "● Offline"}
                </span>
              </div>
              {expandedSection === "agents" && (
                <p className="text-xs text-text-muted pt-2 border-t border-white/5">
                  Seen {useRelativeTime(agent.lastSeenAt)} ago
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Recent Operations */}
      <section 
        onClick={() => toggleSection("recent")}
        className="p-8 bg-card border border-white/5 rounded-lg cursor-pointer hover:border-white/10 transition-all"
      >
        <h2 className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">Recent Operations</h2>
        <div className="space-y-2">
          {recent.slice(0, 10).map((attack: Attack) => (
            <div key={attack.id} className="flex items-center justify-between p-3 bg-bg rounded border border-white/5 hover:border-white/10 transition-all">
              <div className="flex-1">
                <div className="font-bold text-text-primary text-sm">{attack.agent?.hostname || attack.agentId.slice(0, 8)}</div>
                {expandedSection === "recent" && (
                  <div className="text-xs text-text-muted mt-1">
                    {attack.type} • {formatDate(attack.scheduledAt)} • {calculateDuration(attack.startedAt, attack.completedAt)}
                  </div>
                )}
              </div>
              <div className="ml-4">
                {attack.status === "IN_PROGRESS" ? (
                  <span className="text-warning text-sm font-bold animate-pulse">⚡</span>
                ) : attack.status === "PENDING" ? (
                  <span className="text-warning text-sm">⏳</span>
                ) : attack.status === "COMPLETED" ? (
                  <span className="text-success text-sm">✓</span>
                ) : attack.status === "FAILED" ? (
                  <span className="text-danger text-sm">✗</span>
                ) : (
                  <span className="text-text-muted text-sm">{attack.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
