import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateApplicationAction } from "@/app/actions/applications";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { applicationFormDefaults } from "@/features/applications/application-defaults";
import { ApplicationForm } from "@/features/applications/application-form";
import { requireUserId } from "@/lib/auth/require-user";
import { prisma } from "@/lib/db/prisma";
import { applicationRepository } from "@/server/repositories/application-repository";

export const metadata: Metadata = { title: "Edit application" };

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await requireUserId(`/applications/${id}/edit`);
  const [application, resumes] = await Promise.all([
    applicationRepository.findById(userId, id),
    prisma.resume.findMany({
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      select: { id: true, name: true },
      where: { userId },
    }),
  ]);
  if (!application) notFound();

  return (
    <AppShell
      navigation={appNavigation("applications")}
      title="Edit application"
    >
      <div className="mx-auto max-w-5xl">
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href={`/applications/${id}`}
        >
          <ArrowLeft aria-hidden="true" size={17} /> Back to details
        </Link>
        <div className="mt-5">
          <h2 className="text-foreground text-3xl font-semibold tracking-[-0.04em]">
            Edit {application.positionTitle}
          </h2>
          <p className="text-muted mt-2">
            Update this opportunity without losing its activity history.
          </p>
        </div>
        <div className="mt-8">
          <ApplicationForm
            action={updateApplicationAction.bind(null, id)}
            defaultValues={applicationFormDefaults(application)}
            resumes={resumes}
            submitLabel="Save changes"
          />
        </div>
      </div>
    </AppShell>
  );
}
