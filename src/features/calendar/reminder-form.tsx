"use client";

import { useActionState, useEffect, useRef, type FormEvent } from "react";

import {
  createReminderAction,
  type ReminderActionState,
} from "@/app/actions/reminders";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select } from "@/components/ui/form-field";

const initialState: ReminderActionState = { status: "idle" };

export function ReminderForm({
  applications,
}: {
  applications: { companyName: string; id: string; positionTitle: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    createReminderAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const dueAtRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  const titleError = state.fieldErrors?.title?.[0];
  const dueAtError = state.fieldErrors?.dueAt?.[0];

  function prepareUtcDate(event: FormEvent<HTMLFormElement>) {
    const localValue = new FormData(event.currentTarget).get("localDueAt");
    if (dueAtRef.current && typeof localValue === "string" && localValue) {
      dueAtRef.current.value = new Date(localValue).toISOString();
    }
  }

  return (
    <form
      action={formAction}
      className="grid gap-4"
      onSubmit={prepareUtcDate}
      ref={formRef}
    >
      <FormField
        error={titleError}
        htmlFor="reminder-title"
        label="Reminder title"
        required
      >
        <Input id="reminder-title" name="title" required />
      </FormField>
      <FormField
        description="Enter the time shown on this device; CareerOrbit stores it safely in UTC."
        error={dueAtError}
        htmlFor="reminder-due"
        label="Date and time"
        required
      >
        <Input
          aria-describedby={
            dueAtError ? "reminder-due-error" : "reminder-due-description"
          }
          aria-invalid={Boolean(dueAtError)}
          id="reminder-due"
          name="localDueAt"
          required
          type="datetime-local"
        />
        <input name="dueAt" ref={dueAtRef} type="hidden" />
      </FormField>
      <FormField htmlFor="reminder-application" label="Related application">
        <Select id="reminder-application" name="applicationId">
          <option value="">No related application</option>
          {applications.map((application) => (
            <option key={application.id} value={application.id}>
              {application.companyName} — {application.positionTitle}
            </option>
          ))}
        </Select>
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
      <Button disabled={pending} type="submit">
        {pending ? "Creating reminder…" : "Create reminder"}
      </Button>
    </form>
  );
}
