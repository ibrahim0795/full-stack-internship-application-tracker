"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "@/app/actions/auth";
import { ActionMessage } from "@/components/auth/action-message";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/form-field";
import { initialAuthActionState } from "@/lib/auth/action-state";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialAuthActionState,
  );
  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <form action={formAction} className="grid gap-5">
      <input name="callbackUrl" type="hidden" value={callbackUrl} />
      <ActionMessage state={state} />
      <FormField error={emailError} htmlFor="email" label="Email">
        <Input
          aria-describedby={emailError ? "email-error" : undefined}
          aria-invalid={Boolean(emailError)}
          autoComplete="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </FormField>
      <FormField error={passwordError} htmlFor="password" label="Password">
        <Input
          aria-describedby={passwordError ? "password-error" : undefined}
          aria-invalid={Boolean(passwordError)}
          autoComplete="current-password"
          id="password"
          name="password"
          required
          type="password"
        />
      </FormField>
      <div className="flex justify-end">
        <Link
          className="text-primary-strong text-sm font-semibold hover:underline"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>
      <Button disabled={pending} size="lg" type="submit">
        {pending ? "Signing in…" : "Sign in"}
        {!pending ? <ArrowRight aria-hidden="true" size={17} /> : null}
      </Button>
    </form>
  );
}
