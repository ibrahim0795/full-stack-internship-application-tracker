import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { createInterviewAction } from "@/app/actions/interviews";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { emptyInterviewValues } from "@/features/interviews/interview-defaults";
import { InterviewForm } from "@/features/interviews/interview-form";
import { requireUserId } from "@/lib/auth/require-user";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = { title: "Add interview" };

export default async function NewInterviewPage({
  searchParams,
}: {
  searchParams: Promise<{ applicationId?: string }>;
}) {
  const userId = await requireUserId("/interviews/new");
  const parameters = await searchParams;
  const [applications, user] = await Promise.all([
    prisma.application.findMany({
      orderBy: { updatedAt: "desc" },
      select: { companyName: true, id: true, positionTitle: true },
      where: { userId },
    }),
    prisma.user.findUnique({
      select: { timezone: true },
      where: { id: userId },
    }),
  ]);
  const selectedId = applications.some(
    (item) => item.id === parameters.applicationId,
  )
    ? parameters.applicationId!
    : (applications[0]?.id ?? "");
  return (
    <AppShell navigation={appNavigation("interviews")} title="Add interview">
      <div className="mx-auto max-w-5xl">
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href="/interviews"
        >
          <ArrowLeft aria-hidden="true" size={17} /> Back to interviews
        </Link>
        <h2 className="text-foreground mt-5 text-3xl font-semibold tracking-[-0.04em]">
          Schedule an interview
        </h2>
        <p className="text-muted mt-2">
          Record the logistics now, then build the preparation plan.
        </p>
        <div className="mt-8">
          <InterviewForm
            action={createInterviewAction}
            applications={applications}
            defaultValues={emptyInterviewValues(
              selectedId,
              user?.timezone ?? "UTC",
            )}
            submitLabel="Create interview"
          />
        </div>
      </div>
    </AppShell>
  );
}
