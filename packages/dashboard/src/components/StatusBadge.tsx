import { cn } from "@/lib/utils";
import type { AgentStatus, AttackStatus } from "@/lib/types";

type Status = AgentStatus | AttackStatus;

interface Props {
  status: Status;
}

const toneMap: Record<Status, { dot: string; text: string; pulse?: boolean }> = {
  IDLE: { dot: "bg-success", text: "text-success" },
  BUSY: { dot: "bg-danger", text: "text-danger", pulse: true },
  OFFLINE: { dot: "bg-slate-500", text: "text-slate-400" },
  PENDING: { dot: "bg-warning", text: "text-warning" },
  IN_PROGRESS: { dot: "bg-danger", text: "text-danger", pulse: true },
  COMPLETED: { dot: "bg-success", text: "text-success" },
  FAILED: { dot: "bg-danger", text: "text-danger" },
  CANCELLED: { dot: "bg-slate-500", text: "text-slate-400" },
};

export default function StatusBadge({ status }: Props) {
  const tone = toneMap[status];
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full bg-border/60 px-2.5 py-1 text-xs font-medium", tone.text)}>
      <span className={cn("h-2 w-2 rounded-full", tone.dot, tone.pulse && "animate-pulseSlow")} />
      {status}
    </div>
  );
}