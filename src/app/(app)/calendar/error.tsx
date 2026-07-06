"use client";

import { Button } from "@/components/ui/button";

export default function CalendarError({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <h2 className="text-foreground text-3xl font-semibold">
          Calendar could not be loaded
        </h2>
        <p className="text-muted mt-3">
          Your reminders were not changed. Try again.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
