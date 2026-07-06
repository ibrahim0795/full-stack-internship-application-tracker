"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { InterviewActionState } from "@/features/interviews/interview-state";
import {
  interviewFormSchema,
  type InterviewFormValues,
} from "@/features/interviews/interview-schema";
import { requireUserId } from "@/lib/auth/require-user";
import { prisma } from "@/lib/db/prisma";

function valuesFromFormData(formData: FormData) {
  const fields = [
    "applicationId",
    "followUpAt",
    "format",
    "interviewerEmail",
    "interviewerName",
    "interviewerRole",
    "locationOrLink",
    "notes",
    "outcome",
    "scheduledAt",
    "timezone",
  ] as const;
  return Object.fromEntries(
    fields.map((field) => [field, String(formData.get(field) ?? "")]),
  );
}

function interviewData(values: InterviewFormValues) {
  return {
    followUpAt: values.followUpAt ? new Date(values.followUpAt) : null,
    format: values.format,
    interviewerEmail: values.interviewerEmail || null,
    interviewerName: values.interviewerName || null,
    interviewerRole: values.interviewerRole || null,
    locationOrLink: values.locationOrLink || null,
    notes: values.notes || null,
    outcome: values.outcome,
    scheduledAt: new Date(values.scheduledAt),
    timezone: values.timezone,
  };
}

async function ownsApplication(userId: string, applicationId: string) {
  return prisma.application.findFirst({
    select: { id: true },
    where: { id: applicationId, userId },
  });
}

export async function createInterviewAction(
  _state: InterviewActionState,
  formData: FormData,
): Promise<InterviewActionState> {
  const userId = await requireUserId("/interviews/new");
  const parsed = interviewFormSchema.safeParse(valuesFromFormData(formData));
  if (!parsed.success)
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
      status: "error",
    };
  if (!(await ownsApplication(userId, parsed.data.applicationId)))
    return { message: "Selected application was not found.", status: "error" };

  const interview = await prisma.interview.create({
    data: {
      ...interviewData(parsed.data),
      applicationId: parsed.data.applicationId,
      userId,
    },
    select: { id: true },
  });
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  redirect(`/interviews/${interview.id}`);
}

export async function updateInterviewAction(
  interviewId: string,
  _state: InterviewActionState,
  formData: FormData,
): Promise<InterviewActionState> {
  const userId = await requireUserId(`/interviews/${interviewId}/edit`);
  const parsed = interviewFormSchema.safeParse(valuesFromFormData(formData));
  if (!parsed.success)
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
      status: "error",
    };
  if (!(await ownsApplication(userId, parsed.data.applicationId)))
    return { message: "Selected application was not found.", status: "error" };

  const updated = await prisma.interview.updateMany({
    data: {
      ...interviewData(parsed.data),
      applicationId: parsed.data.applicationId,
    },
    where: { id: interviewId, userId },
  });
  if (!updated.count)
    return { message: "Interview not found.", status: "error" };
  revalidatePath("/interviews");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  redirect(`/interviews/${interviewId}`);
}

const questionSchema = z.object({
  answer: z.string().trim().max(10_000),
  category: z.string().trim().max(80),
  prompt: z.string().trim().min(2).max(1_000),
});

export async function addInterviewQuestionAction(
  interviewId: string,
  formData: FormData,
) {
  const userId = await requireUserId(`/interviews/${interviewId}`);
  const parsed = questionSchema.safeParse({
    answer: formData.get("answer"),
    category: formData.get("category"),
    prompt: formData.get("prompt"),
  });
  if (!parsed.success) return;
  const interview = await prisma.interview.findFirst({
    select: { _count: { select: { questions: true } } },
    where: { id: interviewId, userId },
  });
  if (!interview) return;
  await prisma.interviewQuestion.create({
    data: {
      ...parsed.data,
      answer: parsed.data.answer || null,
      category: parsed.data.category || null,
      interviewId,
      position: interview._count.questions,
    },
  });
  revalidatePath(`/interviews/${interviewId}`);
}

export async function updateInterviewQuestionAction(
  interviewId: string,
  questionId: string,
  formData: FormData,
) {
  const userId = await requireUserId(`/interviews/${interviewId}`);
  const parsed = questionSchema.safeParse({
    answer: formData.get("answer"),
    category: formData.get("category"),
    prompt: formData.get("prompt"),
  });
  if (!parsed.success) return;
  await prisma.interviewQuestion.updateMany({
    data: {
      ...parsed.data,
      answer: parsed.data.answer || null,
      category: parsed.data.category || null,
    },
    where: { id: questionId, interview: { id: interviewId, userId } },
  });
  revalidatePath(`/interviews/${interviewId}`);
}

export async function deleteInterviewQuestionAction(
  interviewId: string,
  questionId: string,
) {
  const userId = await requireUserId(`/interviews/${interviewId}`);
  await prisma.interviewQuestion.deleteMany({
    where: { id: questionId, interview: { id: interviewId, userId } },
  });
  revalidatePath(`/interviews/${interviewId}`);
}

const checklistSchema = z.object({ label: z.string().trim().min(2).max(200) });

export async function addChecklistItemAction(
  interviewId: string,
  formData: FormData,
) {
  const userId = await requireUserId(`/interviews/${interviewId}`);
  const parsed = checklistSchema.safeParse({ label: formData.get("label") });
  if (!parsed.success) return;
  const interview = await prisma.interview.findFirst({
    select: { _count: { select: { checklistItems: true } } },
    where: { id: interviewId, userId },
  });
  if (!interview) return;
  await prisma.checklistItem.create({
    data: {
      interviewId,
      label: parsed.data.label,
      position: interview._count.checklistItems,
    },
  });
  revalidatePath(`/interviews/${interviewId}`);
}

export async function toggleChecklistItemAction(
  interviewId: string,
  itemId: string,
  completed: boolean,
) {
  const userId = await requireUserId(`/interviews/${interviewId}`);
  await prisma.checklistItem.updateMany({
    data: { completedAt: completed ? new Date() : null },
    where: { id: itemId, interview: { id: interviewId, userId } },
  });
  revalidatePath(`/interviews/${interviewId}`);
}

export async function deleteChecklistItemAction(
  interviewId: string,
  itemId: string,
) {
  const userId = await requireUserId(`/interviews/${interviewId}`);
  await prisma.checklistItem.deleteMany({
    where: { id: itemId, interview: { id: interviewId, userId } },
  });
  revalidatePath(`/interviews/${interviewId}`);
}

export async function deleteInterviewAction(interviewId: string) {
  const userId = await requireUserId(`/interviews/${interviewId}`);
  await prisma.interview.deleteMany({ where: { id: interviewId, userId } });
  revalidatePath("/interviews");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  redirect("/interviews");
}
