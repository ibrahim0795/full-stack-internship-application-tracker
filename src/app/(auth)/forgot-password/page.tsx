import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      description="Enter your account email. For privacy, the response is the same whether or not an account exists."
      eyebrow="Account recovery"
      footer={
        <p className="text-muted text-center text-sm">
          Remembered it?{" "}
          <Link
            className="text-primary-strong font-semibold hover:underline"
            href="/login"
          >
            Return to sign in
          </Link>
        </p>
      }
      title="Reset your password"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
