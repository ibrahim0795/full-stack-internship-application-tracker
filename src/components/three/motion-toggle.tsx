"use client";

import { Gauge, Pause } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  setUserReducedMotion,
  useMotionPreference,
} from "@/hooks/use-motion-preference";

export function MotionToggle() {
  const { systemReduced, userReduced } = useMotionPreference();

  if (systemReduced) {
    return (
      <span className="border-border bg-background/80 text-muted inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold backdrop-blur-xl">
        <Pause aria-hidden="true" size={15} />
        System reduced motion
      </span>
    );
  }

  return (
    <Button
      className="bg-background/80 min-h-10 px-4 text-xs backdrop-blur-xl"
      onClick={() => setUserReducedMotion(!userReduced)}
      size="sm"
      variant="secondary"
    >
      {userReduced ? (
        <Gauge aria-hidden="true" size={15} />
      ) : (
        <Pause aria-hidden="true" size={15} />
      )}
      {userReduced ? "Enable motion" : "Reduce motion"}
    </Button>
  );
}
