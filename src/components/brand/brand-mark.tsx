import Link from "next/link";

import { cn } from "@/lib/utils/cn";

export interface BrandMarkProps {
  className?: string;
  compact?: boolean;
}

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <Link
      className={cn(
        "group focus-visible:outline-focus inline-flex min-h-11 items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4",
        className,
      )}
      href="/"
      aria-label="CareerOrbit home"
    >
      <span className="border-primary/35 bg-primary/10 relative grid size-9 place-items-center rounded-full border shadow-[0_0_28px_var(--primary-shadow)]">
        <span className="bg-primary size-2.5 rounded-full shadow-[0_0_12px_var(--primary)]" />
        <span className="border-accent/50 absolute inset-1 -rotate-12 rounded-[50%] border" />
      </span>
      {compact ? null : (
        <span className="text-foreground text-base font-semibold tracking-[-0.02em]">
          Career<span className="text-primary-strong">Orbit</span>
        </span>
      )}
    </Link>
  );
}
