import * as React from "react";
import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-border bg-bg/80 px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warning",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}