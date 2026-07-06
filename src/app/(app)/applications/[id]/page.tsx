import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  UserPlus,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  addApplicationNoteAction,
  addCompanyContactAction,
  deleteApplicationAction,
} from "@/app/actions/applications";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContactForm } from "@/features/applications/contact-form";
import {
  applicationStageLabels,
  employmentTypeLabels,
  workArrangementLabels,
} from "@/features/applications/application-schema";
import { DeleteApplicationForm } from "@/features/applications/delete-application-form";
import { NoteForm } from "@/features/applications/note-form";
import { requireUserId } from "@/lib/auth/require-user";
import { applicationRepository } from "@/server/repositories/application-repository";

export const metadata: Metadata = { title: "Application details" };

function salary(application: {
  currency: string | null;
  salaryMaximum: { toString(): string } | null;
  salaryMinimum: { toString(): string } | null;
}) {
  if (!application.salaryMinimum && !application.salaryMaximum)
    return "Not recorded";
  const range = [application.salaryMinimum, application.salaryMaximum]
    .filter(Boolean)
    .map((value) => value?.toString())
    .join(" – ");
  return `${application.currency ?? ""} ${range}`.trim();
}

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await requireUserId(`/applications/${id}`);
  const application = await applicationRepository.findById(userId, id);
  if (!application) notFound();

  const addNote = addApplicationNoteAction.bind(null, id);
  const addContact = addCompanyContactAction.bind(null, id);
  const deleteApplication = deleteApplicationAction.bind(null, id);

  return (
    <AppShell
      navigation={appNavigation("applications")}
      title="Application details"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href="/applications"
          >
            <ArrowLeft aria-hidden="true" size={17} /> Back to applications
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={`/interviews/new?applicationId=${id}`}
            >
              Schedule interview
            </Link>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={`/applications/${id}/edit`}
            >
              <Pencil aria-hidden="true" size={17} /> Edit
            </Link>
            <DeleteApplicationForm
              action={deleteApplication}
              companyName={application.companyName}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge>{applicationStageLabels[application.stage]}</Badge>
            <h2 className="text-foreground mt-4 text-4xl font-semibold tracking-[-0.05em]">
              {application.positionTitle}
            </h2>
            <p className="text-muted mt-2 text-xl">{application.companyName}</p>
          </div>
          {application.jobUrl ? (
            <a
              className={buttonVariants()}
              href={application.jobUrl}
              rel="noreferrer"
              target="_blank"
            >
              View job post <ExternalLink aria-hidden="true" size={17} />
            </a>
          ) : null}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-5">
            <Card>
              <CardHeader>
                <h3 className="text-foreground text-xl font-semibold">
                  Opportunity details
                </h3>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <Detail
                  label="Employment"
                  value={employmentTypeLabels[application.employmentType]}
                />
                <Detail
                  label="Arrangement"
                  value={workArrangementLabels[application.workArrangement]}
                />
                <Detail
                  label="Location"
                  value={
                    [application.city, application.country]
                      .filter(Boolean)
                      .join(", ") || "Not recorded"
                  }
                  icon={<MapPin aria-hidden="true" size={16} />}
                />
                <Detail label="Salary" value={salary(application)} />
                <Detail
                  label="Applied"
                  value={
                    application.applicationDate?.toLocaleDateString() ??
                    "Not recorded"
                  }
                  icon={<CalendarDays aria-hidden="true" size={16} />}
                />
                <Detail
                  label="Closing"
                  value={
                    application.closingDate?.toLocaleDateString() ??
                    "Not recorded"
                  }
                />
                <Detail
                  label="Interview"
                  value={
                    application.interviewDate?.toLocaleDateString() ??
                    "Not scheduled"
                  }
                />
                <Detail
                  label="CV version"
                  value={application.resume?.name ?? "Not assigned"}
                />
                {application.tags.length ? (
                  <div className="sm:col-span-2">
                    <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
                      Skills
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {application.tags.map(({ tag }) => (
                        <Badge key={tag.id} tone="violet">
                          {tag.displayName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {application.jobDescription || application.personalNotes ? (
              <Card>
                <CardHeader>
                  <h3 className="text-foreground text-xl font-semibold">
                    Context
                  </h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {application.jobDescription ? (
                    <TextBlock
                      label="Job description"
                      value={application.jobDescription}
                    />
                  ) : null}
                  {application.personalNotes ? (
                    <TextBlock
                      label="Personal notes"
                      value={application.personalNotes}
                    />
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardHeader>
                <h3 className="text-foreground text-xl font-semibold">
                  Activity notes
                </h3>
                <p className="text-muted text-sm">
                  Capture conversations, decisions, and next actions.
                </p>
              </CardHeader>
              <CardContent>
                <NoteForm action={addNote} />
                <div className="border-border mt-6 grid gap-4 border-t pt-6">
                  {application.notes.length ? (
                    application.notes.map((note) => (
                      <article
                        className="bg-surface-raised rounded-2xl p-4"
                        key={note.id}
                      >
                        <p className="text-foreground text-sm leading-7 whitespace-pre-wrap">
                          {note.body}
                        </p>
                        <time
                          className="text-muted mt-2 block text-xs"
                          dateTime={note.createdAt.toISOString()}
                        >
                          {note.createdAt.toLocaleString()}
                        </time>
                      </article>
                    ))
                  ) : (
                    <p className="text-muted text-sm">No activity notes yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid content-start gap-5">
            <Card>
              <CardHeader>
                <UserPlus
                  className="text-primary-strong"
                  aria-hidden="true"
                  size={20}
                />
                <h3 className="text-foreground text-xl font-semibold">
                  Company contacts
                </h3>
              </CardHeader>
              <CardContent>
                <ContactForm action={addContact} />
                <div className="border-border mt-6 grid gap-3 border-t pt-6">
                  {application.contacts.length ? (
                    application.contacts.map((contact) => (
                      <div
                        className="bg-surface-raised rounded-2xl p-4"
                        key={contact.id}
                      >
                        <p className="text-foreground font-semibold">
                          {contact.name}
                        </p>
                        {contact.role ? (
                          <p className="text-muted mt-1 text-sm">
                            {contact.role}
                          </p>
                        ) : null}
                        {contact.email ? (
                          <a
                            className="text-primary-strong mt-2 inline-flex items-center gap-2 text-sm hover:underline"
                            href={`mailto:${contact.email}`}
                          >
                            <Mail aria-hidden="true" size={14} />
                            {contact.email}
                          </a>
                        ) : null}
                        {contact.profileUrl ? (
                          <a
                            className="text-primary-strong mt-2 block text-sm hover:underline"
                            href={contact.profileUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Open profile
                          </a>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-sm">No contacts recorded.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-muted flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase">
        {icon}
        {label}
      </p>
      <p className="text-foreground mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
        {label}
      </h4>
      <p className="text-foreground mt-3 text-sm leading-7 whitespace-pre-wrap">
        {value}
      </p>
    </div>
  );
}
