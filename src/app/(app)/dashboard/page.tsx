import { ArrowRight, LogOut, Orbit, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { appNavigation } from "@/components/layout/app-navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  return (
    <AppShell navigation={appNavigation("dashboard")} title="Dashboard">
      <div className="mx-auto max-w-5xl">
        <Badge tone="success">
          <ShieldCheck aria-hidden="true" size={14} /> Authenticated session
        </Badge>
        <h2 className="text-foreground mt-6 text-4xl font-semibold tracking-[-0.04em]">
          Welcome
          {session.user.name ? `, ${session.user.name}` : " to CareerOrbit"}.
        </h2>
        <p className="text-muted mt-4 max-w-2xl text-lg leading-8">
          Your private mission control is secured. Start building a clear,
          searchable record of every opportunity.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Orbit
                className="text-primary-strong"
                aria-hidden="true"
                size={22}
              />
              <h3 className="text-foreground pt-3 text-xl font-semibold">
                Account ready
              </h3>
            </CardHeader>
            <CardContent className="text-muted text-sm leading-7">
              Signed in as {session.user.email ?? "a GitHub-authenticated user"}
              . Private data will always be scoped to your user ID.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck
                className="text-success"
                aria-hidden="true"
                size={22}
              />
              <h3 className="text-foreground pt-3 text-xl font-semibold">
                Server protected
              </h3>
            </CardHeader>
            <CardContent className="text-muted text-sm leading-7">
              Both the route proxy and this server-rendered page verify your
              encrypted session before showing private content.
            </CardContent>
          </Card>
        </div>

        <Link
          className={buttonVariants({ className: "mt-8" })}
          href="/applications"
        >
          Open applications <ArrowRight aria-hidden="true" size={17} />
        </Link>

        <form action={logoutAction} className="mt-8">
          <Button type="submit" variant="secondary">
            <LogOut aria-hidden="true" size={17} /> Sign out
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
