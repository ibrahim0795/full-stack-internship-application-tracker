"use client";

import { Trash2 } from "lucide-react";
import { useActionState } from "react";

import type { ResumeActionState } from "./resume-state";
import { initialResumeState } from "./resume-state";

import { Button } from "@/components/ui/button";

export function DeleteResumeForm({
  action,
}: {
  action: (
    state: ResumeActionState,
    formData: FormData,
  ) => Promise<ResumeActionState>;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    initialResumeState,
  );
  return (
    <div>
      <form action={formAction}>
        <Button disabled={pending} size="sm" type="submit" variant="ghost">
          <Trash2 aria-hidden="true" size={14} />
          {pending ? "Deleting…" : "Delete"}
        </Button>
      </form>
      {state.message ? (
        <p
          className={
            state.status === "error"
              ? "text-danger mt-2 text-xs"
              : "text-muted mt-2 text-xs"
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
