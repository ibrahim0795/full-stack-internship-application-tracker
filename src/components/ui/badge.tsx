import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex min-h-7 items-center gap-2 rounded-full border px-3 text-xs font-semibold tracking-[0.08em] uppercase",
  {
    variants: {
      tone: {
        cyan: "border-primary/25 bg-primary/10 text-primary-strong",
        violet: "border-accent/25 bg-accent/10 text-accent-strong",
        neutral: "border-border bg-surface text-muted",
        success: "border-success/25 bg-success/10 text-success",
      },
    },
    defaultVariants: { tone: "cyan" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
