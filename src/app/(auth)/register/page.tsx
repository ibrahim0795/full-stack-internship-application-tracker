import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthCard
      description="Create a private workspace for applications, interviews, deadlines, and CV versions."
      eyebrow="Start your journey"
      footer={
        <p className="text-muted text-center text-sm">
          Already have an account?{" "}
          <Link
            className="text-primary-strong font-semibold hover:underline"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      }
      title="Create your CareerOrbit"
    >
      <RegisterForm />
    </AuthCard>
  );
}
