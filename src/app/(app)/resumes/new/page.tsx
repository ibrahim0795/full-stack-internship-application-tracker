import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { createResumeAction } from "@/app/actions/resumes";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { emptyResumeValues } from "@/features/resumes/resume-defaults";
import { ResumeForm } from "@/features/resumes/resume-form";
import { requireUserId } from "@/lib/auth/require-user";
export const metadata: Metadata = { title: "Add CV" };
export default async function NewResumePage() {
  await requireUserId("/resumes/new");
  return (
    <AppShell navigation={appNavigation("resumes")} title="Add CV">
      <div className="mx-auto max-w-4xl">
        <Link className={buttonVariants({ variant: "ghost" })} href="/resumes">
          <ArrowLeft aria-hidden="true" size={17} /> Back to CV manager
        </Link>
        <h2 className="text-foreground mt-5 text-3xl font-semibold">
          Add a CV version
        </h2>
        <div className="mt-8">
          <ResumeForm
            action={createResumeAction}
            defaultValues={emptyResumeValues}
            submitLabel="Create CV record"
          />
        </div>
      </div>
    </AppShell>
  );
}
