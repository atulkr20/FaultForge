import * as React from "react";
import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded border border-white/5 bg-bg px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:border-primary/50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}