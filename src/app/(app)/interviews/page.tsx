import { InterviewOutcome } from "@prisma/client";
import { CalendarClock, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  interviewFormatLabels,
  interviewOutcomeLabels,
} from "@/features/interviews/interview-schema";
import { requireUserId } from "@/lib/auth/require-user";
import { interviewRepository } from "@/server/repositories/interview-repository";

export const metadata: Metadata = { title: "Interviews" };

export default async function InterviewsPage() {
  const userId = await requireUserId("/interviews");
  const interviews = await interviewRepository.list(userId);
  const now = new Date();
  const upcoming = interviews.filter(
    (interview) =>
      interview.outcome === InterviewOutcome.PENDING &&
      interview.scheduledAt >= now,
  );
  const history = interviews
    .filter((interview) => !upcoming.includes(interview))
    .reverse();

  return (
    <AppShell navigation={appNavigation("interviews")} title="Interviews">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="violet">Preparation workspace</Badge>
            <h2 className="text-foreground mt-4 text-3xl font-semibold tracking-[-0.04em]">
              Interview preparation
            </h2>
            <p className="text-muted mt-2">
              Turn each meeting into a clear preparation plan.
            </p>
          </div>
          <Link className={buttonVariants()} href="/interviews/new">
            <Plus aria-hidden="true" size={17} /> Add interview
          </Link>
        </div>
        <InterviewSection
          empty="No upcoming interviews scheduled."
          interviews={upcoming}
          title="Upcoming"
        />
        <InterviewSection
          empty="Completed and past interviews will appear here."
          interviews={history}
          title="History"
        />
      </div>
    </AppShell>
  );
}

function InterviewSection({
  empty,
  interviews,
  title,
}: {
  empty: string;
  interviews: Awaited<ReturnType<typeof interviewRepository.list>>;
  title: string;
}) {
  return (
    <section className="mt-8">
      <h3 className="text-foreground text-xl font-semibold">{title}</h3>
      {interviews.length ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {interviews.map((interview) => {
            const complete = interview.checklistItems.filter(
              (item) => item.completedAt,
            ).length;
            const answered = interview.questions.filter(
              (question) => question.answer,
            ).length;
            return (
              <Link href={`/interviews/${interview.id}`} key={interview.id}>
                <Card className="hover:border-primary/35 h-full transition">
                  <CardContent>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-foreground text-lg font-semibold">
                          {interview.application.companyName}
                        </p>
                        <p className="text-muted mt-1 text-sm">
                          {interview.application.positionTitle}
                        </p>
                      </div>
                      <Badge
                        tone={
                          interview.outcome === "PENDING" ? "cyan" : "neutral"
                        }
                      >
                        {interviewOutcomeLabels[interview.outcome]}
                      </Badge>
                    </div>
                    <p className="text-primary-strong mt-4 flex items-center gap-2 text-sm">
                      <CalendarClock aria-hidden="true" size={16} />
                      {interview.scheduledAt.toLocaleString("en", {
                        timeZone: interview.timezone,
                      })}
                    </p>
                    <div className="text-muted mt-4 flex flex-wrap gap-3 text-xs">
                      <span>{interviewFormatLabels[interview.format]}</span>
                      <span>
                        {complete}/{interview.checklistItems.length} checklist
                      </span>
                      <span>
                        {answered}/{interview.questions.length} answered
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="mt-4 border-dashed">
          <CardContent className="text-muted py-12 text-center text-sm">
            {empty}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
