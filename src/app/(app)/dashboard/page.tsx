import {
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  CircleCheckBig,
  Clock3,
  LogOut,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/actions/auth";
import { auth } from "@/auth";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { applicationStageLabels } from "@/features/applications/application-schema";
import { calculateDashboard } from "@/features/dashboard/dashboard-calculations";
import {
  StatusChart,
  TimelineChart,
} from "@/features/dashboard/dashboard-charts";
import { cn } from "@/lib/utils/cn";
import {
  getDashboardApplications,
  getDashboardReminders,
} from "@/server/repositories/dashboard-repository";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");
  const [applications, reminders] = await Promise.all([
    getDashboardApplications(session.user.id),
    getDashboardReminders(session.user.id),
  ]);
  const dashboard = calculateDashboard(applications);

  return (
    <AppShell navigation={appNavigation("dashboard")} title="Dashboard">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="success">Live application data</Badge>
            <h2 className="text-foreground mt-4 text-4xl font-semibold tracking-[-0.05em]">
              Welcome{session.user.name ? `, ${session.user.name}` : " back"}.
            </h2>
            <p className="text-muted mt-3 max-w-2xl text-lg">
              See where your search is moving and what deserves attention next.
            </p>
          </div>
          <Link className={buttonVariants()} href="/applications/new">
            Add application <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <MetricCard
            icon={<BriefcaseBusiness />}
            label="Total applications"
            value={dashboard.metrics.total}
          />
          <MetricCard
            icon={<TrendingUp />}
            label="Submitted this week"
            value={dashboard.metrics.submittedThisWeek}
          />
          <MetricCard
            icon={<CalendarDays />}
            label="Upcoming deadlines"
            value={dashboard.metrics.upcomingDeadlines}
          />
          <MetricCard
            icon={<CalendarClock />}
            label="Upcoming interviews"
            value={dashboard.metrics.upcomingInterviews}
          />
          <MetricCard
            icon={<UsersRound />}
            label="Interview rate"
            suffix="%"
            value={dashboard.metrics.interviewRate}
          />
          <MetricCard
            icon={<CircleCheckBig />}
            label="Offer rate"
            suffix="%"
            value={dashboard.metrics.offerRate}
          />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-foreground text-xl font-semibold">
                Applications by status
              </h3>
              <p className="text-muted text-sm">
                Your complete pipeline distribution.
              </p>
            </CardHeader>
            <CardContent>
              <StatusChart data={dashboard.statusData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-foreground text-xl font-semibold">
                Applications over time
              </h3>
              <p className="text-muted text-sm">
                New opportunities recorded during the last eight weeks.
              </p>
            </CardHeader>
            <CardContent>
              <TimelineChart data={dashboard.timeline} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          <DashboardList
            empty="No upcoming or overdue deadlines."
            icon={<CalendarDays aria-hidden="true" size={20} />}
            title="Deadlines"
          >
            {dashboard.deadlines.map((deadline) => (
              <Link
                className="bg-surface-raised hover:border-primary/30 block rounded-2xl border border-transparent p-4 transition"
                href={deadline.href}
                key={deadline.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-foreground font-semibold">
                      {deadline.companyName}
                    </p>
                    <p className="text-muted mt-1 text-sm">
                      {deadline.positionTitle}
                    </p>
                  </div>
                  {deadline.overdue ? (
                    <Badge tone="neutral">Overdue</Badge>
                  ) : null}
                </div>
                <time
                  className={cn(
                    "mt-3 block text-xs",
                    deadline.overdue ? "text-danger" : "text-muted",
                  )}
                  dateTime={deadline.date.toISOString()}
                >
                  {deadline.date.toLocaleDateString()}
                </time>
              </Link>
            ))}
          </DashboardList>

          <DashboardList
            empty="No interviews scheduled in the next 14 days."
            icon={<UsersRound aria-hidden="true" size={20} />}
            title="Interviews"
          >
            {dashboard.interviews.map((interview) => (
              <Link
                className="bg-surface-raised hover:border-primary/30 block rounded-2xl border border-transparent p-4 transition"
                href={interview.href}
                key={interview.id}
              >
                <p className="text-foreground font-semibold">
                  {interview.companyName}
                </p>
                <p className="text-muted mt-1 text-sm">
                  {interview.positionTitle}
                </p>
                <time
                  className="text-primary-strong mt-3 block text-xs"
                  dateTime={interview.date.toISOString()}
                >
                  {interview.date.toLocaleString()}
                </time>
              </Link>
            ))}
          </DashboardList>

          <DashboardList
            empty="Add an opportunity to receive a recommended next action."
            icon={<Sparkles aria-hidden="true" size={20} />}
            title="Recommended next actions"
          >
            {dashboard.actions.map((action) => (
              <Link
                className="bg-surface-raised hover:border-primary/30 block rounded-2xl border border-transparent p-4 transition"
                href={action.href}
                key={action.id}
              >
                <div className="flex items-center gap-2">
                  <Target
                    className={
                      action.urgency === "high"
                        ? "text-danger"
                        : "text-primary-strong"
                    }
                    aria-hidden="true"
                    size={16}
                  />
                  <p className="text-foreground font-semibold">
                    {action.label}
                  </p>
                </div>
                <p className="text-muted mt-2 text-sm leading-6">
                  {action.reason}
                </p>
              </Link>
            ))}
          </DashboardList>
        </div>

        <Card className="mt-6">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <BellRing
                className="text-primary-strong"
                aria-hidden="true"
                size={20}
              />
              <h3 className="text-foreground mt-3 text-xl font-semibold">
                Reminders
              </h3>
              <p className="text-muted mt-1 text-sm">
                Incomplete reminders due within 30 days, including overdue
                items.
              </p>
            </div>
            <Link
              className={buttonVariants({ size: "sm", variant: "ghost" })}
              href="/calendar"
            >
              Open calendar
            </Link>
          </CardHeader>
          <CardContent>
            {reminders.length ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {reminders.map((reminder) => {
                  const overdue = reminder.dueAt < new Date();
                  const content = (
                    <>
                      <p className="text-foreground font-semibold">
                        {reminder.title}
                      </p>
                      <time
                        className={cn(
                          "mt-2 block text-xs",
                          overdue ? "text-danger" : "text-muted",
                        )}
                        dateTime={reminder.dueAt.toISOString()}
                      >
                        {overdue ? "Overdue · " : ""}
                        {reminder.dueAt.toLocaleString()}
                      </time>
                    </>
                  );
                  const relatedApplicationId =
                    reminder.applicationId ?? reminder.interview?.applicationId;
                  return relatedApplicationId ? (
                    <Link
                      className="bg-surface-raised hover:border-primary/30 rounded-2xl border border-transparent p-4 transition"
                      href={`/applications/${relatedApplicationId}`}
                      key={reminder.id}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div
                      className="bg-surface-raised rounded-2xl p-4"
                      key={reminder.id}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted py-8 text-center text-sm">
                No incomplete reminders are due within 30 days.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                Recently updated
              </h3>
              <p className="text-muted mt-1 text-sm">
                Your latest application activity.
              </p>
            </div>
            <Link
              className={buttonVariants({ size: "sm", variant: "ghost" })}
              href="/applications"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {dashboard.recent.length ? (
              <div className="divide-border divide-y">
                {dashboard.recent.map((application) => (
                  <Link
                    className="hover:bg-surface flex flex-col gap-2 px-2 py-4 transition sm:flex-row sm:items-center sm:justify-between"
                    href={`/applications/${application.id}`}
                    key={application.id}
                  >
                    <div>
                      <p className="text-foreground font-semibold">
                        {application.positionTitle}
                      </p>
                      <p className="text-muted mt-1 text-sm">
                        {application.companyName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>{applicationStageLabels[application.stage]}</Badge>
                      <span className="text-muted flex items-center gap-1 text-xs">
                        <Clock3 aria-hidden="true" size={13} />
                        {application.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid min-h-40 place-items-center text-center">
                <div>
                  <p className="text-foreground font-semibold">
                    No application activity yet
                  </p>
                  <p className="text-muted mt-2 text-sm">
                    Add an opportunity to activate your dashboard.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <form action={logoutAction} className="mt-8">
          <Button type="submit" variant="secondary">
            <LogOut aria-hidden="true" size={17} /> Sign out
          </Button>
        </form>
      </div>
    </AppShell>
  );
}

function MetricCard({
  icon,
  label,
  suffix = "",
  value,
}: {
  icon: ReactNode;
  label: string;
  suffix?: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-primary-strong [&_svg]:size-5">{icon}</div>
        <p className="text-foreground mt-4 text-3xl font-semibold">
          {value}
          {suffix}
        </p>
        <p className="text-muted mt-1 text-sm">{label}</p>
      </CardContent>
    </Card>
  );
}

function DashboardList({
  children,
  empty,
  icon,
  title,
}: {
  children: ReactNode;
  empty: string;
  icon: ReactNode;
  title: string;
}) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);
  return (
    <Card>
      <CardHeader>
        <div className="text-primary-strong">{icon}</div>
        <h3 className="text-foreground pt-2 text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        {hasChildren ? (
          <div className="grid gap-3">{children}</div>
        ) : (
          <p className="text-muted py-8 text-center text-sm">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}
