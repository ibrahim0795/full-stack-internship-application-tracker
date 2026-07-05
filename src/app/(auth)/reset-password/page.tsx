import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Choose new password" };

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token = "" } = await searchParams;

  return (
    <AuthCard
      description="Reset links are single-use and expire after 30 minutes."
      eyebrow="Secure reset"
      footer={
        <p className="text-muted text-center text-sm">
          <Link
            className="text-primary-strong font-semibold hover:underline"
            href="/login"
          >
            Return to sign in
          </Link>
        </p>
      }
      title="Choose a new password"
    >
      {!token ? (
        <p
          className="border-danger/25 bg-danger/10 text-danger mb-5 rounded-2xl border px-4 py-3 text-sm"
          role="alert"
        >
          This reset link is incomplete. Request a new one.
        </p>
      ) : null}
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
