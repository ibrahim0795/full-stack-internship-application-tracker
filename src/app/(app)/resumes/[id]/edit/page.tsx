import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateResumeAction } from "@/app/actions/resumes";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { resumeDefaults } from "@/features/resumes/resume-defaults";
import { ResumeForm } from "@/features/resumes/resume-form";
import { requireUserId } from "@/lib/auth/require-user";
import { resumeRepository } from "@/server/repositories/resume-repository";
export const metadata: Metadata = { title: "Edit CV" };
export default async function EditResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await requireUserId(`/resumes/${id}/edit`);
  const resume = await resumeRepository.findById(userId, id);
  if (!resume) notFound();
  return (
    <AppShell navigation={appNavigation("resumes")} title="Edit CV">
      <div className="mx-auto max-w-4xl">
        <Link className={buttonVariants({ variant: "ghost" })} href="/resumes">
          <ArrowLeft aria-hidden="true" size={17} /> Back to CV manager
        </Link>
        <h2 className="text-foreground mt-5 text-3xl font-semibold">
          Edit {resume.name}
        </h2>
        <p className="text-muted mt-2">
          Currently assigned to {resume.applications.length} application
          {resume.applications.length === 1 ? "" : "s"}.
        </p>
        <div className="mt-8">
          <ResumeForm
            action={updateResumeAction.bind(null, id)}
            defaultValues={resumeDefaults(resume)}
            submitLabel="Save CV"
          />
        </div>
      </div>
    </AppShell>
  );
}
