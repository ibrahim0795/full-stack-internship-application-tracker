"use client";

import { KeyRound } from "lucide-react";
import { useActionState } from "react";

import { resetPasswordAction } from "@/app/actions/auth";
import { ActionMessage } from "@/components/auth/action-message";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/form-field";
import { initialAuthActionState } from "@/lib/auth/action-state";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <input name="token" type="hidden" value={token} />
      <ActionMessage state={state} />
      <FormField
        description="Use 12+ characters with uppercase, lowercase, and a number."
        error={state.fieldErrors?.password?.[0]}
        htmlFor="password"
        label="New password"
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
        label="Confirm new password"
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
      <Button disabled={pending || !token} size="lg" type="submit">
        <KeyRound aria-hidden="true" size={17} />
        {pending ? "Updating password…" : "Update password"}
      </Button>
    </form>
  );
}
