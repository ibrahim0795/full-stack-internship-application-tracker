"use client";

import { useActionState, useEffect, useRef } from "react";

import type { InlineApplicationActionState } from "@/app/actions/applications";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/form-field";

const initialState: InlineApplicationActionState = { status: "idle" };

export function ContactForm({
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

  function error(field: string) {
    return state.fieldErrors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="grid gap-4" ref={formRef}>
      <FormField
        error={error("name")}
        htmlFor="contact-name"
        label="Name"
        required
      >
        <Input
          aria-invalid={Boolean(error("name"))}
          id="contact-name"
          name="name"
          required
        />
      </FormField>
      <FormField error={error("role")} htmlFor="contact-role" label="Role">
        <Input id="contact-role" name="role" />
      </FormField>
      <FormField error={error("email")} htmlFor="contact-email" label="Email">
        <Input
          aria-invalid={Boolean(error("email"))}
          id="contact-email"
          name="email"
          type="email"
        />
      </FormField>
      <FormField
        error={error("profileUrl")}
        htmlFor="contact-profile"
        label="Profile URL"
      >
        <Input
          aria-invalid={Boolean(error("profileUrl"))}
          id="contact-profile"
          name="profileUrl"
          type="url"
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
      <Button disabled={pending} type="submit" variant="secondary">
        {pending ? "Adding contact…" : "Add contact"}
      </Button>
    </form>
  );
}
