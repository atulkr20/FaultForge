import { useEffect, useMemo, useState } from "react";
import { getRelativeTime } from "@/lib/utils";

export function useRelativeTime(value?: string | Date | null) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => getRelativeTime(value), [value, tick]);
}