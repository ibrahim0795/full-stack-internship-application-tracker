import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { createApplicationAction } from "@/app/actions/applications";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { emptyApplicationValues } from "@/features/applications/application-defaults";
import { ApplicationForm } from "@/features/applications/application-form";
import { requireUserId } from "@/lib/auth/require-user";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = { title: "Add application" };

export default async function NewApplicationPage() {
  const userId = await requireUserId("/applications/new");
  const resumes = await prisma.resume.findMany({
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    select: { id: true, name: true },
    where: { userId },
  });

  return (
    <AppShell
      navigation={appNavigation("applications")}
      title="Add application"
    >
      <div className="mx-auto max-w-5xl">
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href="/applications"
        >
          <ArrowLeft aria-hidden="true" size={17} /> Back to applications
        </Link>
        <div className="mt-5">
          <h2 className="text-foreground text-3xl font-semibold tracking-[-0.04em]">
            Add an opportunity
          </h2>
          <p className="text-muted mt-2">
            Capture enough detail to make your next action obvious.
          </p>
        </div>
        <div className="mt-8">
          <ApplicationForm
            action={createApplicationAction}
            defaultValues={emptyApplicationValues}
            resumes={resumes}
            submitLabel="Create application"
          />
        </div>
      </div>
    </AppShell>
  );
}
