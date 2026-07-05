"use client";

import { Mail } from "lucide-react";
import { useActionState } from "react";

import { requestPasswordResetAction } from "@/app/actions/auth";
import { ActionMessage } from "@/components/auth/action-message";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/form-field";
import { initialAuthActionState } from "@/lib/auth/action-state";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <ActionMessage state={state} />
      <FormField
        error={state.fieldErrors?.email?.[0]}
        htmlFor="email"
        label="Email"
      >
        <Input
          aria-describedby={
            state.fieldErrors?.email ? "email-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.email)}
          autoComplete="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </FormField>
      <Button disabled={pending} size="lg" type="submit">
        <Mail aria-hidden="true" size={17} />
        {pending ? "Preparing instructions…" : "Send reset instructions"}
      </Button>
    </form>
  );
}
