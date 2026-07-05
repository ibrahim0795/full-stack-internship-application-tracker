"use server";

import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { headers } from "next/headers";

import { signIn, signOut } from "@/auth";
import type { AuthActionState } from "@/lib/auth/action-state";
import { hashPassword } from "@/lib/auth/password";
import { checkAuthRateLimit } from "@/lib/auth/rate-limit";
import { deliverPasswordReset } from "@/lib/auth/reset-delivery";
import {
  forgotPasswordSchema,
  loginSchema,
  registrationSchema,
  resetPasswordSchema,
} from "@/lib/auth/schemas";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import {
  consumePasswordResetToken,
  createPasswordResetToken,
} from "@/lib/auth/reset-token";
import { prisma } from "@/lib/db/prisma";

async function getRequestIdentifier() {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}

function fieldErrors(error: {
  flatten(): { fieldErrors: Record<string, string[]> };
}) {
  return error.flatten().fieldErrors;
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), status: "error" };
  }

  const redirectTo = getSafeRedirectPath(formData.get("callbackUrl"));
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
    return { status: "success" };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Email or password is incorrect. Please try again.",
        status: "error",
      };
    }
    throw error;
  }
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registrationSchema.safeParse({
    confirmPassword: formData.get("confirmPassword"),
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), status: "error" };
  }

  const requestIdentifier = await getRequestIdentifier();
  const rateLimit = checkAuthRateLimit({
    key: `register:${requestIdentifier}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return {
      message: `Too many registration attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
      status: "error",
    };
  }

  try {
    const passwordHash = await hashPassword(parsed.data.password);
    await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        fieldErrors: { email: ["An account with this email already exists."] },
        status: "error",
      };
    }
    throw error;
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
    return { status: "success" };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Your account was created. Sign in to continue.",
        status: "success",
      };
    }
    throw error;
  }
}

export async function requestPasswordResetAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), status: "error" };
  }

  const requestIdentifier = await getRequestIdentifier();
  const rateLimit = checkAuthRateLimit({
    key: `reset-request:${requestIdentifier}:${parsed.data.email}`,
    limit: 4,
    windowMs: 60 * 60 * 1000,
  });

  if (rateLimit.allowed) {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (user?.email) {
      const token = await createPasswordResetToken(user.id);
      try {
        await deliverPasswordReset({ email: user.email, token });
      } catch (error) {
        console.error("Password reset delivery failed.", {
          cause:
            error instanceof Error ? error.message : "Unknown delivery error",
        });
      }
    }
  }

  return {
    message:
      "If an account exists for that email, reset instructions will be sent shortly.",
    status: "success",
  };
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    confirmPassword: formData.get("confirmPassword"),
    password: formData.get("password"),
    token: formData.get("token"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), status: "error" };
  }

  const requestIdentifier = await getRequestIdentifier();
  const rateLimit = checkAuthRateLimit({
    key: `reset-complete:${requestIdentifier}`,
    limit: 6,
    windowMs: 30 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return {
      message: "Too many attempts. Request a new reset link later.",
      status: "error",
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const reset = await consumePasswordResetToken(
    parsed.data.token,
    passwordHash,
  );
  return reset
    ? { message: "Password updated. You can now sign in.", status: "success" }
    : {
        message: "This reset link is invalid or has expired.",
        status: "error",
      };
}

export async function githubSignInAction() {
  await signIn("github", { redirectTo: "/dashboard" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
