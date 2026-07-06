"use client";

import { useActionState, useEffect, useRef } from "react";

import type { InlineApplicationActionState } from "@/app/actions/applications";
import { Button } from "@/components/ui/button";
import { FormField, Textarea } from "@/components/ui/form-field";

const initialState: InlineApplicationActionState = { status: "idle" };

export function NoteForm({
  action,
}: {
  action: (
    state: InlineApplicationActionState,
    formData: FormData,
  ) => Promise<InlineApplicationActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  const error = state.fieldErrors?.body?.[0];
  return (
    <form action={formAction} className="grid gap-3" ref={formRef}>
      <FormField error={error} htmlFor="body" label="New note" required>
        <Textarea
          aria-describedby={error ? "body-error" : undefined}
          aria-invalid={Boolean(error)}
          id="body"
          name="body"
          required
          rows={3}
        />
      </FormField>
      {state.message ? (
        <p
          className={
            state.status === "error"
              ? "text-danger text-sm"
              : "text-success text-sm"
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
      <Button className="justify-self-start" disabled={pending} type="submit">
        {pending ? "Adding note…" : "Add note"}
      </Button>
    </form>
  );
}
