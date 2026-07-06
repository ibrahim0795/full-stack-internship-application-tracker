import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { NextResponse } from "next/server";

import { checkAuthRateLimit } from "@/lib/auth/rate-limit";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { loginSchema } from "@/lib/auth/schemas";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";

const invalidPasswordHash =
  "$2b$12$qcWHWIOhJMYZIsjIQya.TO5jfO/cFBbpgAInzCqlwLMRMmZaoFl5a";

const credentialsProvider = Credentials({
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials, request) {
    const parsed = loginSchema.safeParse(credentials);
    if (!parsed.success) return null;

    const forwardedFor = request.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim();
    const rateLimit = checkAuthRateLimit({
      key: `login:${forwardedFor ?? "unknown"}:${parsed.data.email}`,
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.allowed) return null;

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    const passwordValid = await verifyPassword(
      parsed.data.password,
      user?.passwordHash ?? invalidPasswordHash,
    );

    if (!user?.email || !user.passwordHash || !passwordValid) return null;

    return {
      email: user.email,
      id: user.id,
      image: user.image,
      name: user.name,
    };
  },
});

const providers: NextAuthConfig["providers"] = [credentialsProvider];

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  );
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const protectedRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/applications") ||
        pathname.startsWith("/kanban") ||
        pathname.startsWith("/calendar") ||
        pathname.startsWith("/interviews");
      const authPage = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
      ].some((path) => pathname.startsWith(path));

      if (protectedRoute) return Boolean(auth?.user);
      if (authPage && auth?.user) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
      }
      return true;
    },
    redirect({ baseUrl, url }) {
      if (url.startsWith("/"))
        return `${baseUrl}${getSafeRedirectPath(url, "/")}`;

      try {
        return new URL(url).origin === baseUrl ? url : baseUrl;
      } catch {
        return baseUrl;
      }
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    error: "/login",
    signIn: "/login",
  },
  providers,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
