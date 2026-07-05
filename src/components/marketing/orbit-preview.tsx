import {
  ArrowUpRight,
  CalendarClock,
  CircleCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function OrbitPreview() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[34rem]"
      aria-label="Career workflow preview"
    >
      <div className="border-primary/20 absolute inset-[7%] rounded-full border shadow-[0_0_80px_var(--primary-shadow)]" />
      <div className="border-accent/20 absolute inset-[22%] rounded-full border" />
      <div className="border-border-strong bg-surface absolute inset-[38%] grid place-items-center rounded-full border shadow-[0_20px_80px_var(--panel-shadow)]">
        <div className="text-center">
          <span className="bg-primary/12 text-primary-strong mx-auto grid size-12 place-items-center rounded-2xl">
            <Sparkles aria-hidden="true" size={22} />
          </span>
          <p className="text-foreground mt-3 text-sm font-semibold">
            Career hub
          </p>
          <p className="text-muted mt-1 text-xs">Next action ready</p>
        </div>
      </div>

      <Card className="absolute top-[5%] left-[2%] w-[48%] rotate-[-3deg] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-muted text-xs">Frontend internship</p>
            <p className="text-foreground mt-1 text-sm font-semibold sm:text-base">
              Application ready
            </p>
          </div>
          <ArrowUpRight
            className="text-primary-strong shrink-0"
            aria-hidden="true"
            size={18}
          />
        </div>
        <Badge className="mt-4" tone="cyan">
          Saved
        </Badge>
      </Card>

      <Card className="absolute top-[36%] right-0 w-[44%] rotate-[3deg] p-4 sm:p-5">
        <CalendarClock
          className="text-accent-strong"
          aria-hidden="true"
          size={20}
        />
        <p className="text-foreground mt-3 text-sm font-semibold">
          Interview tomorrow
        </p>
        <p className="text-muted mt-1 text-xs">Preparation 80% complete</p>
      </Card>

      <Card className="absolute bottom-[2%] left-[8%] w-[48%] rotate-[2deg] p-4 sm:p-5">
        <CircleCheck className="text-success" aria-hidden="true" size={20} />
        <p className="text-foreground mt-3 text-sm font-semibold">
          Follow-up sent
        </p>
        <p className="text-muted mt-1 text-xs">Everything stays in orbit</p>
      </Card>
    </div>
  );
}
