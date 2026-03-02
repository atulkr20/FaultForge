import { cn } from "@/lib/utils";
import type { AgentStatus, AttackStatus } from "@/lib/types";

type Status = AgentStatus | AttackStatus;

interface Props {
  status: Status;
}

const toneMap: Record<Status, { dot: string; text: string; pulse?: boolean }> = {
  IDLE: { dot: "bg-success", text: "text-text-primary" },
  BUSY: { dot: "bg-warning", text: "text-text-primary", pulse: true },
  OFFLINE: { dot: "bg-slate-500", text: "text-text-muted" },
  PENDING: { dot: "bg-warning", text: "text-text-primary" },
  IN_PROGRESS: { dot: "bg-warning", text: "text-text-primary", pulse: true },
  COMPLETED: { dot: "bg-success", text: "text-text-primary" },
  FAILED: { dot: "bg-danger", text: "text-text-primary" },
  CANCELLED: { dot: "bg-slate-500", text: "text-text-muted" },
};

export default function StatusBadge({ status }: Props) {
  const tone = toneMap[status];
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-md border border-white/5 bg-bg/70 px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em]", tone.text)}>
      <span className={cn("h-2 w-2 rounded-full", tone.dot, tone.pulse && "animate-pulseSlow")} />
      {status}
    </div>
  );
}