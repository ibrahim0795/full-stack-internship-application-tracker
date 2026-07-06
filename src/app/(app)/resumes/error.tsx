"use client";
import { Button } from "@/components/ui/button";
export default function ResumesError({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <h2 className="text-foreground text-3xl font-semibold">
          CV manager could not be loaded
        </h2>
        <p className="text-muted mt-3">Your CV records were not changed.</p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
