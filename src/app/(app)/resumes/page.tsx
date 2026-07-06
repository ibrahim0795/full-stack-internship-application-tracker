import { ExternalLink, FileText, Plus, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  deleteResumeAction,
  setDefaultResumeAction,
} from "@/app/actions/resumes";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { applicationStageLabels } from "@/features/applications/application-schema";
import { DeleteResumeForm } from "@/features/resumes/delete-resume-form";
import { resolveResumeStorage } from "@/features/resumes/storage";
import { requireUserId } from "@/lib/auth/require-user";
import { resumeRepository } from "@/server/repositories/resume-repository";

export const metadata: Metadata = { title: "CV manager" };

export default async function ResumesPage() {
  const userId = await requireUserId("/resumes");
  const resumes = await resumeRepository.list(userId);
  return (
    <AppShell navigation={appNavigation("resumes")} title="CV manager">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="violet">CV versions</Badge>
            <h2 className="text-foreground mt-4 text-3xl font-semibold tracking-[-0.04em]">
              Match each role with the right CV
            </h2>
            <p className="text-muted mt-2">
              Track metadata, external references, defaults, and real
              application usage.
            </p>
          </div>
          <Link className={buttonVariants()} href="/resumes/new">
            <Plus aria-hidden="true" size={17} /> Add CV
          </Link>
        </div>
        {resumes.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {resumes.map((resume) => {
              const storage = resolveResumeStorage(resume);
              return (
                <Card key={resume.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <FileText
                          className="text-primary-strong"
                          aria-hidden="true"
                          size={22}
                        />
                        <h3 className="text-foreground mt-3 text-xl font-semibold">
                          {resume.name}
                        </h3>
                        <p className="text-muted mt-1 text-sm">
                          {resume.targetRole ?? "General-purpose CV"}
                        </p>
                      </div>
                      {resume.isDefault ? (
                        <Badge tone="success">
                          <Star aria-hidden="true" size={13} /> Default
                        </Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted text-sm">
                      <span className="text-foreground font-semibold">
                        {resume.applications.length}
                      </span>{" "}
                      application{resume.applications.length === 1 ? "" : "s"}{" "}
                      use this CV
                    </p>
                    {resume.applications.length ? (
                      <div className="mt-4 grid gap-2">
                        {resume.applications.slice(0, 4).map((application) => (
                          <Link
                            className="bg-surface-raised flex items-center justify-between gap-3 rounded-xl p-3 text-sm"
                            href={`/applications/${application.id}`}
                            key={application.id}
                          >
                            <span className="text-foreground truncate">
                              {application.companyName} —{" "}
                              {application.positionTitle}
                            </span>
                            <Badge tone="neutral">
                              {applicationStageLabels[application.stage]}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {storage.kind === "external-url" ? (
                        <a
                          className={buttonVariants({
                            size: "sm",
                            variant: "secondary",
                          })}
                          href={storage.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Open external file{" "}
                          <ExternalLink aria-hidden="true" size={14} />
                        </a>
                      ) : (
                        <span className="text-muted self-center text-xs">
                          {storage.kind === "managed-object"
                            ? "Managed storage reference"
                            : "Metadata only"}
                        </span>
                      )}
                      <Link
                        className={buttonVariants({
                          size: "sm",
                          variant: "secondary",
                        })}
                        href={`/resumes/${resume.id}/edit`}
                      >
                        Edit
                      </Link>
                      {!resume.isDefault ? (
                        <form
                          action={setDefaultResumeAction.bind(null, resume.id)}
                        >
                          <Button size="sm" type="submit" variant="ghost">
                            <Star aria-hidden="true" size={14} /> Make default
                          </Button>
                        </form>
                      ) : null}
                      <DeleteResumeForm
                        action={deleteResumeAction.bind(null, resume.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="mt-8 border-dashed">
            <CardContent className="grid min-h-64 place-items-center text-center">
              <div>
                <FileText
                  className="text-primary-strong mx-auto"
                  aria-hidden="true"
                  size={34}
                />
                <h3 className="text-foreground mt-4 text-xl font-semibold">
                  No CV versions yet
                </h3>
                <p className="text-muted mt-2">
                  Add the CV you currently use, then create targeted versions as
                  your search grows.
                </p>
                <Link
                  className={buttonVariants({ className: "mt-5" })}
                  href="/resumes/new"
                >
                  Add CV
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
