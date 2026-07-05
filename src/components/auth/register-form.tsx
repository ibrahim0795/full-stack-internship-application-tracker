"use client";

import { ArrowRight } from "lucide-react";
import { useActionState } from "react";

import { registerAction } from "@/app/actions/auth";
import { ActionMessage } from "@/components/auth/action-message";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/form-field";
import { initialAuthActionState } from "@/lib/auth/action-state";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <ActionMessage state={state} />
      <FormField
        error={state.fieldErrors?.name?.[0]}
        htmlFor="name"
        label="Name"
      >
        <Input
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          autoComplete="name"
          id="name"
          name="name"
          required
        />
      </FormField>
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
          required
          type="email"
        />
      </FormField>
      <FormField
        description="Use 12+ characters with uppercase, lowercase, and a number."
        error={state.fieldErrors?.password?.[0]}
        htmlFor="password"
        label="Password"
      >
        <Input
          aria-describedby={
            state.fieldErrors?.password
              ? "password-error"
              : "password-description"
          }
          aria-invalid={Boolean(state.fieldErrors?.password)}
          autoComplete="new-password"
          id="password"
          name="password"
          required
          type="password"
        />
      </FormField>
      <FormField
        error={state.fieldErrors?.confirmPassword?.[0]}
        htmlFor="confirmPassword"
        label="Confirm password"
      >
        <Input
          aria-describedby={
            state.fieldErrors?.confirmPassword
              ? "confirmPassword-error"
              : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
          autoComplete="new-password"
          id="confirmPassword"
          name="confirmPassword"
          required
          type="password"
        />
      </FormField>
      <Button disabled={pending} size="lg" type="submit">
        {pending ? "Creating account…" : "Create account"}
        {!pending ? <ArrowRight aria-hidden="true" size={17} /> : null}
      </Button>
    </form>
  );
}
