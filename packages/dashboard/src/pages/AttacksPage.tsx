import { Fragment, useMemo, useState, type MouseEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAgents, getAttacks, cancelAttack } from "@/lib/api";
import type { AttackStatus } from "@/lib/types";
import { calculateDuration, formatDate } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AttacksPage() {
  const [status, setStatus] = useState<string>("");
  const [agentId, setAgentId] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
    refetchInterval: 5000,
  });

  const { data: attacks = [] } = useQuery({
    queryKey: ["attacks", "filtered", agentId, status],
    queryFn: () => getAttacks({ agentId: agentId || undefined, status: status || undefined }),
    refetchInterval: 5000,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAttack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attacks"] });
    },
  });

  const handleCancel = (attackId: string, e: MouseEvent) => {
    e.stopPropagation();
    if (confirm("Cancel this operation?")) {
      cancelMutation.mutate(attackId);
    }
  };

  const rows = useMemo(() => {
    return [...attacks].sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));
  }, [attacks]);

  const statusStats = {
    all: rows.length,
    active: rows.filter((r) => r.status === "PENDING" || r.status === "IN_PROGRESS").length,
    completed: rows.filter((r) => r.status === "COMPLETED").length,
    failed: rows.filter((r) => r.status === "FAILED").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <section className="p-6 bg-card border border-white/5 rounded-lg">
        <h2 className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">Operations Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-text-muted text-xs mb-1">Total</p>
            <p className="text-4xl font-extrabold text-text-primary">{statusStats.all}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Running</p>
            <p className="text-4xl font-extrabold text-warning">{statusStats.active}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Completed</p>
            <p className="text-4xl font-extrabold text-success">{statusStats.completed}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Failed</p>
            <p className="text-4xl font-extrabold text-danger">{statusStats.failed}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="p-6 bg-card border border-white/5 rounded-lg">
        <h2 className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-text-muted mb-2">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "CANCELLED"] as AttackStatus[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-2">Agent</label>
            <Select value={agentId} onChange={(e) => setAgentId(e.target.value)}>
              <option value="">All Agents</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.hostname}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-end">
            <Button 
              onClick={() => {
                setStatus("");
                setAgentId("");
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Operations List */}
      <section className="space-y-3">
        {rows.length === 0 ? (
          <div className="p-6 bg-card border border-white/5 rounded-lg text-center text-text-muted">
            No operations found
          </div>
        ) : (
          rows.map((attack) => (
            <Fragment key={attack.id}>
              <div 
                onClick={() => setExpandedId(expandedId === attack.id ? null : attack.id)}
                className="p-4 bg-card border border-white/5 rounded-lg cursor-pointer hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-text-primary">
                      {attack.agent?.hostname || attack.agentId.slice(0, 8)}
                    </div>
                    <div className="text-xs text-text-muted mt-1 uppercase">
                      {attack.type} • {formatDate(attack.scheduledAt)}
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-xs font-bold mb-2">
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
                    <div className="text-xs text-text-muted">
                      {calculateDuration(attack.startedAt, attack.completedAt)}
                    </div>
                  </div>
                </div>

                {expandedId === attack.id && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    <div>
                      <p className="text-xs text-text-muted mb-2 uppercase">Target</p>
                      <p className="text-sm text-text-primary">{attack.target?.name || "No target"}</p>
                    </div>

                    <div>
                      <p className="text-xs text-text-muted mb-2 uppercase">Configuration</p>
                      <pre className="bg-bg p-3 rounded text-xs overflow-auto max-h-48 text-text-muted border border-white/5">
                        {JSON.stringify(attack.payload, null, 2)}
                      </pre>
                    </div>

                    {attack.errorMessage && (
                      <div>
                        <p className="text-xs text-danger font-bold uppercase">Error</p>
                        <p className="text-sm text-danger mt-1">{attack.errorMessage}</p>
                      </div>
                    )}

                    {(attack.status === "PENDING" || attack.status === "IN_PROGRESS") && (
                      <Button
                        variant="danger"
                        onClick={(e) => handleCancel(attack.id, e)}
                        disabled={cancelMutation.isPending}
                      >
                        Cancel Operation
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Fragment>
          ))
        )}
      </section>
    </div>
  );
}
