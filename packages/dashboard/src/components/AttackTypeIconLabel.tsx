import { Cpu, Wifi } from "lucide-react";
import type { AttackType } from "@/lib/types";

export default function AttackTypeIconLabel({ type }: { type: AttackType }) {
  if (type === "CPU_STRESS") {
    return (
      <div className="inline-flex items-center gap-2">
        <Cpu className="h-4 w-4 text-danger" />
        <span>CPU_STRESS</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Wifi className="h-4 w-4 text-warning" />
      <span>NETWORK_LATENCY</span>
    </div>
  );
}