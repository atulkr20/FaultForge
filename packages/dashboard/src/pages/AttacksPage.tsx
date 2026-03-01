import { Fragment, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAgents, getAttacks, cancelAttack } from "@/lib/api";
import type { AttackStatus, AttackType } from "@/lib/types";
import { calculateDuration, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const handleCancel = (attackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to cancel this attack?")) {
      cancelMutation.mutate(attackId);
    }
  };

  const rows = useMemo(() => {
    const data = attackType ? attacks.filter((a) => a.type === attackType) : attacks;
    return [...data].sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));
  }, [attacks, attackType]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attacks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              {(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "CANCELLED"] as AttackStatus[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>

            <Select value={agentId} onChange={(e) => setAgentId(e.target.value)}>
              <option value="">All Agents</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.hostname}</option>
              ))}
            </Select>

            <Select value={attackType} onChange={(e) => setAttackType(e.target.value)}>
              <option value="">All Attack Types</option>
              {(["CPU_STRESS", "NETWORK_LATENCY"] as AttackType[]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attack Type</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((attack) => (
                <Fragment key={attack.id}>
                  <TableRow key={attack.id} className="cursor-pointer" onClick={() => setExpanded((curr) => curr === attack.id ? null : attack.id)}>
                    <TableCell><AttackTypeIconLabel type={attack.type} /></TableCell>
                    <TableCell>{attack.agent?.hostname ?? attack.agentId.slice(0, 8)}</TableCell>
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
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  {expanded === attack.id && (
                    <TableRow key={`${attack.id}-expanded`}>
                      <TableCell colSpan={6}>
                        <pre className="overflow-auto rounded-md border border-border bg-bg p-3 font-mono text-xs text-text-muted">
                          {JSON.stringify(attack.payload, null, 2)}
                        </pre>
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