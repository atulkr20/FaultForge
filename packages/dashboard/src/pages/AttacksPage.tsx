import { Fragment, useMemo, useState, type MouseEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAgents, getAttacks, cancelAttack } from "@/lib/api";
import type { AttackStatus, AttackType } from "@/lib/types";
import { calculateDuration, formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import AttackTypeIconLabel from "@/components/AttackTypeIconLabel";

export default function AttacksPage() {
  const [status, setStatus] = useState<string>("");
  const [agentId, setAgentId] = useState<string>("");
  const [attackType, setAttackType] = useState<string>("");
  const [expanded, setExpanded] = useState<string | null>(null);
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
    const data = attackType ? attacks.filter((a) => a.type === attackType) : attacks;
    return [...data].sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));
  }, [attacks, attackType]);

  const activeCount = rows.filter((r) => r.status === "PENDING" || r.status === "IN_PROGRESS").length;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardDescription>Operation Stream</CardDescription>
          <CardTitle className="text-2xl">Attack Logbook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.08em] text-text-muted">Status Filter</p>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                {(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "CANCELLED"] as AttackStatus[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.08em] text-text-muted">Agent Filter</p>
              <Select value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                <option value="">All Agents</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.hostname}</option>
                ))}
              </Select>
            </div>
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.08em] text-text-muted">Type Filter</p>
              <Select value={attackType} onChange={(e) => setAttackType(e.target.value)}>
                <option value="">All Attack Types</option>
                {(["CPU_STRESS", "NETWORK_LATENCY"] as AttackType[]).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border bg-bg/60 px-3 py-2 text-xs text-text-muted">
            <span className="uppercase tracking-[0.08em]">Visible Records:</span>
            <span className="font-semibold text-text-primary">{rows.length}</span>
            <span className="uppercase tracking-[0.08em]">Active:</span>
            <span className="font-semibold text-warning">{activeCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((attack) => (
                <Fragment key={attack.id}>
                  <TableRow className="cursor-pointer" onClick={() => setExpanded((curr) => curr === attack.id ? null : attack.id)}>
                    <TableCell><AttackTypeIconLabel type={attack.type} /></TableCell>
                    <TableCell>{attack.agent?.hostname ?? attack.agentId.slice(0, 8)}</TableCell>
                    <TableCell className="text-text-muted">{attack.target?.name ?? "-"}</TableCell>
                    <TableCell><StatusBadge status={attack.status} /></TableCell>
                    <TableCell>{calculateDuration(attack.startedAt, attack.completedAt)}</TableCell>
                    <TableCell className="text-text-muted">{formatDate(attack.scheduledAt)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {(attack.status === "PENDING" || attack.status === "IN_PROGRESS") && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={(e) => handleCancel(attack.id, e)}
                          disabled={cancelMutation.isPending}
                        >
                          Abort
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>

                  {expanded === attack.id && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="space-y-2 rounded-md border border-border bg-bg/70 p-3">
                          <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Payload Snapshot</p>
                          <pre className="overflow-auto font-mono text-xs text-text-muted">
                            {JSON.stringify(attack.payload, null, 2)}
                          </pre>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
