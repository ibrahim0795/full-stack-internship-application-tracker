import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function requireUserId(callbackUrl = "/dashboard") {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session.user.id;
}
