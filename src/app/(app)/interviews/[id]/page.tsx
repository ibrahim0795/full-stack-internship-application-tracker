import { Check, Mail, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  addChecklistItemAction,
  addInterviewQuestionAction,
  deleteChecklistItemAction,
  deleteInterviewAction,
  deleteInterviewQuestionAction,
  toggleChecklistItemAction,
  updateInterviewQuestionAction,
} from "@/app/actions/interviews";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormField, Input, Textarea } from "@/components/ui/form-field";
import { DeleteInterviewForm } from "@/features/interviews/delete-interview-form";
import {
  interviewFormatLabels,
  interviewOutcomeLabels,
} from "@/features/interviews/interview-schema";
import { requireUserId } from "@/lib/auth/require-user";
import { interviewRepository } from "@/server/repositories/interview-repository";

export const metadata: Metadata = { title: "Interview preparation" };

export default async function InterviewDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await requireUserId(`/interviews/${id}`);
  const interview = await interviewRepository.findById(userId, id);
  if (!interview) notFound();
  const completed = interview.checklistItems.filter(
    (item) => item.completedAt,
  ).length;
  const progress = interview.checklistItems.length
    ? Math.round((completed / interview.checklistItems.length) * 100)
    : 0;
  const locationIsLink =
    interview.locationOrLink && /^https?:\/\//i.test(interview.locationOrLink);

  return (
    <AppShell
      navigation={appNavigation("interviews")}
      title="Interview preparation"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge
              tone={interview.outcome === "PENDING" ? "violet" : "neutral"}
            >
              {interviewOutcomeLabels[interview.outcome]}
            </Badge>
            <h2 className="text-foreground mt-4 text-4xl font-semibold tracking-[-0.05em]">
              {interview.application.companyName}
            </h2>
            <p className="text-muted mt-2 text-lg">
              {interview.application.positionTitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={`/interviews/${id}/edit`}
            >
              <Pencil aria-hidden="true" size={16} /> Edit details
            </Link>
            <DeleteInterviewForm
              action={deleteInterviewAction.bind(null, id)}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_20rem]">
          <Card>
            <CardHeader>
              <h3 className="text-foreground text-xl font-semibold">
                Meeting brief
              </h3>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <Detail
                label="Scheduled"
                value={interview.scheduledAt.toLocaleString("en", {
                  timeZone: interview.timezone,
                })}
              />
              <Detail
                label="Format"
                value={interviewFormatLabels[interview.format]}
              />
              <Detail label="Timezone" value={interview.timezone} />
              <Detail
                label="Follow-up"
                value={
                  interview.followUpAt?.toLocaleString("en", {
                    timeZone: interview.timezone,
                  }) ?? "Not scheduled"
                }
              />
              <Detail
                label="Interviewer"
                value={interview.interviewerName ?? "Not recorded"}
              />
              <Detail
                label="Role"
                value={interview.interviewerRole ?? "Not recorded"}
              />
              {interview.interviewerEmail ? (
                <a
                  className="text-primary-strong flex items-center gap-2 text-sm hover:underline"
                  href={`mailto:${interview.interviewerEmail}`}
                >
                  <Mail aria-hidden="true" size={15} />
                  {interview.interviewerEmail}
                </a>
              ) : null}
              {interview.locationOrLink ? (
                <div className="sm:col-span-2">
                  <p className="text-muted text-xs font-semibold uppercase">
                    Location or link
                  </p>
                  {locationIsLink ? (
                    <a
                      className="text-primary-strong mt-2 block text-sm hover:underline"
                      href={interview.locationOrLink}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open meeting link
                    </a>
                  ) : (
                    <p className="text-foreground mt-2 text-sm">
                      {interview.locationOrLink}
                    </p>
                  )}
                </div>
              ) : null}
              {interview.notes ? (
                <div className="sm:col-span-2">
                  <p className="text-muted text-xs font-semibold uppercase">
                    Notes
                  </p>
                  <p className="text-foreground mt-2 text-sm leading-7 whitespace-pre-wrap">
                    {interview.notes}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-foreground text-xl font-semibold">
                Preparation progress
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-foreground text-4xl font-semibold">
                {progress}%
              </p>
              <div className="bg-border mt-4 h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-muted mt-3 text-sm">
                {completed} of {interview.checklistItems.length} checklist items
                complete
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-foreground text-xl font-semibold">
                Preparation checklist
              </h3>
            </CardHeader>
            <CardContent>
              <form
                action={addChecklistItemAction.bind(null, id)}
                className="flex gap-2"
              >
                <Input
                  aria-label="New checklist item"
                  name="label"
                  placeholder="Add preparation task"
                  required
                />
                <Button type="submit" size="icon">
                  <Plus aria-hidden="true" size={17} />
                </Button>
              </form>
              <div className="mt-5 grid gap-3">
                {interview.checklistItems.length ? (
                  interview.checklistItems.map((item) => {
                    const toggle = toggleChecklistItemAction.bind(
                      null,
                      id,
                      item.id,
                      !item.completedAt,
                    );
                    const remove = deleteChecklistItemAction.bind(
                      null,
                      id,
                      item.id,
                    );
                    return (
                      <div
                        className="bg-surface-raised flex items-center gap-3 rounded-2xl p-3"
                        key={item.id}
                      >
                        <form action={toggle}>
                          <Button
                            aria-label={
                              item.completedAt
                                ? "Reopen checklist item"
                                : "Complete checklist item"
                            }
                            size="icon"
                            type="submit"
                            variant="ghost"
                          >
                            {item.completedAt ? (
                              <RotateCcw aria-hidden="true" size={16} />
                            ) : (
                              <Check aria-hidden="true" size={16} />
                            )}
                          </Button>
                        </form>
                        <p
                          className={
                            item.completedAt
                              ? "text-muted flex-1 line-through"
                              : "text-foreground flex-1"
                          }
                        >
                          {item.label}
                        </p>
                        <form action={remove}>
                          <Button
                            aria-label="Delete checklist item"
                            size="icon"
                            type="submit"
                            variant="ghost"
                          >
                            <Trash2 aria-hidden="true" size={15} />
                          </Button>
                        </form>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted py-8 text-center text-sm">
                    No checklist items yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-foreground text-xl font-semibold">
                Questions and answers
              </h3>
            </CardHeader>
            <CardContent>
              <form
                action={addInterviewQuestionAction.bind(null, id)}
                className="grid gap-3"
              >
                <FormField htmlFor="new-prompt" label="New question" required>
                  <Input id="new-prompt" name="prompt" required />
                </FormField>
                <Input
                  aria-label="Question category"
                  name="category"
                  placeholder="Category, e.g. Technical"
                />
                <Textarea
                  aria-label="Draft answer"
                  name="answer"
                  placeholder="Optional draft answer"
                  rows={3}
                />
                <Button className="justify-self-start" type="submit">
                  Add question
                </Button>
              </form>
              <div className="border-border mt-6 grid gap-4 border-t pt-6">
                {interview.questions.length ? (
                  interview.questions.map((question) => (
                    <form
                      action={updateInterviewQuestionAction.bind(
                        null,
                        id,
                        question.id,
                      )}
                      className="bg-surface-raised grid gap-3 rounded-2xl p-4"
                      key={question.id}
                    >
                      <Input
                        aria-label="Question prompt"
                        defaultValue={question.prompt}
                        name="prompt"
                        required
                      />
                      <Input
                        aria-label="Question category"
                        defaultValue={question.category ?? ""}
                        name="category"
                      />
                      <Textarea
                        aria-label={`Answer to ${question.prompt}`}
                        defaultValue={question.answer ?? ""}
                        name="answer"
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" type="submit" variant="secondary">
                          Save answer
                        </Button>
                        <Button
                          formAction={deleteInterviewQuestionAction.bind(
                            null,
                            id,
                            question.id,
                          )}
                          size="sm"
                          type="submit"
                          variant="ghost"
                        >
                          <Trash2 aria-hidden="true" size={14} /> Delete
                        </Button>
                      </div>
                    </form>
                  ))
                ) : (
                  <p className="text-muted py-8 text-center text-sm">
                    No preparation questions yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
        {label}
      </p>
      <p className="text-foreground mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}
