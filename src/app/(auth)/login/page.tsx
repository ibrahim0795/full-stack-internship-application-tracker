import { Code2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { githubSignInAction } from "@/app/actions/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";

export const metadata: Metadata = { title: "Sign in" };

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const parameters = await searchParams;
  const callbackUrl = getSafeRedirectPath(parameters.callbackUrl ?? null);
  const githubEnabled = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );

  return (
    <AuthCard
      description="Return to your applications, interviews, and next actions."
      eyebrow="Mission control"
      footer={
        <p className="text-muted text-center text-sm">
          New to CareerOrbit?{" "}
          <Link
            className="text-primary-strong font-semibold hover:underline"
            href="/register"
          >
            Create an account
          </Link>
        </p>
      }
      title="Welcome back"
    >
      {parameters.error ? (
        <p
          className="border-danger/25 bg-danger/10 text-danger mb-5 rounded-2xl border px-4 py-3 text-sm"
          role="alert"
        >
          Sign-in could not be completed. Try again or use your email and
          password.
        </p>
      ) : null}
      {githubEnabled ? (
        <>
          <form action={githubSignInAction}>
            <Button
              className="w-full"
              size="lg"
              type="submit"
              variant="secondary"
            >
              <Code2 aria-hidden="true" size={18} />
              Continue with GitHub
            </Button>
          </form>
          <div className="text-muted my-6 flex items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase">
            <span className="bg-border h-px flex-1" /> or{" "}
            <span className="bg-border h-px flex-1" />
          </div>
        </>
      ) : null}
      <LoginForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}
