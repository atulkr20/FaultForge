import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-border text-text-primary",
        success: "bg-success/15 text-success",
        danger: "bg-danger/15 text-danger",
        warning: "bg-warning/15 text-warning",
        neutral: "bg-slate-500/20 text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}