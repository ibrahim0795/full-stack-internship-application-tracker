import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateInterviewAction } from "@/app/actions/interviews";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { interviewDefaults } from "@/features/interviews/interview-defaults";
import { InterviewForm } from "@/features/interviews/interview-form";
import { requireUserId } from "@/lib/auth/require-user";
import { prisma } from "@/lib/db/prisma";
import { interviewRepository } from "@/server/repositories/interview-repository";

export const metadata: Metadata = { title: "Edit interview" };

export default async function EditInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await requireUserId(`/interviews/${id}/edit`);
  const [interview, applications] = await Promise.all([
    interviewRepository.findById(userId, id),
    prisma.application.findMany({
      orderBy: { updatedAt: "desc" },
      select: { companyName: true, id: true, positionTitle: true },
      where: { userId },
    }),
  ]);
  if (!interview) notFound();
  return (
    <AppShell navigation={appNavigation("interviews")} title="Edit interview">
      <div className="mx-auto max-w-5xl">
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href={`/interviews/${id}`}
        >
          <ArrowLeft aria-hidden="true" size={17} /> Back to preparation
        </Link>
        <h2 className="text-foreground mt-5 text-3xl font-semibold tracking-[-0.04em]">
          Edit {interview.application.companyName} interview
        </h2>
        <div className="mt-8">
          <InterviewForm
            action={updateInterviewAction.bind(null, id)}
            applications={applications}
            defaultValues={interviewDefaults(interview)}
            submitLabel="Save interview"
          />
        </div>
      </div>
    </AppShell>
  );
}
