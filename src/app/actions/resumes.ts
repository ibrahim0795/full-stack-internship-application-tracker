"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  resumeFormSchema,
  resumeValuesFromFormData,
} from "@/features/resumes/resume-schema";
import type { ResumeFormValues } from "@/features/resumes/resume-schema";
import type { ResumeActionState } from "@/features/resumes/resume-state";
import { requireUserId } from "@/lib/auth/require-user";
import { prisma } from "@/lib/db/prisma";

function resumeData(values: ResumeFormValues) {
  return {
    fileUrl: values.fileUrl || null,
    mimeType: values.mimeType || null,
    name: values.name,
    originalFilename: values.originalFilename || null,
    sizeBytes: values.sizeBytes ? Number(values.sizeBytes) : null,
    targetRole: values.targetRole || null,
  };
}

export async function createResumeAction(
  _state: ResumeActionState,
  formData: FormData,
): Promise<ResumeActionState> {
  const userId = await requireUserId("/resumes/new");
  const parsed = resumeFormSchema.safeParse(resumeValuesFromFormData(formData));
  if (!parsed.success)
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
      status: "error",
    };

  const resume = await prisma.$transaction(async (transaction) => {
    const count = await transaction.resume.count({ where: { userId } });
    const isDefault = parsed.data.isDefault || count === 0;
    if (isDefault)
      await transaction.resume.updateMany({
        data: { isDefault: false },
        where: { userId },
      });
    return transaction.resume.create({
      data: { ...resumeData(parsed.data), isDefault, userId },
      select: { id: true },
    });
  });
  revalidatePath("/resumes");
  redirect(`/resumes/${resume.id}/edit`);
}

export async function updateResumeAction(
  resumeId: string,
  _state: ResumeActionState,
  formData: FormData,
): Promise<ResumeActionState> {
  const userId = await requireUserId(`/resumes/${resumeId}/edit`);
  const parsed = resumeFormSchema.safeParse(resumeValuesFromFormData(formData));
  if (!parsed.success)
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
      status: "error",
    };

  const updated = await prisma.$transaction(async (transaction) => {
    const owned = await transaction.resume.findFirst({
      select: { id: true },
      where: { id: resumeId, userId },
    });
    if (!owned) return false;
    if (parsed.data.isDefault)
      await transaction.resume.updateMany({
        data: { isDefault: false },
        where: { userId },
      });
    await transaction.resume.update({
      data: {
        ...resumeData(parsed.data),
        ...(parsed.data.isDefault ? { isDefault: true } : {}),
      },
      where: { id: resumeId },
    });
    return true;
  });
  if (!updated) return { message: "CV record not found.", status: "error" };
  revalidatePath("/resumes");
  revalidatePath("/applications");
  redirect("/resumes");
}

export async function setDefaultResumeAction(resumeId: string) {
  const userId = await requireUserId("/resumes");
  await prisma.$transaction(async (transaction) => {
    const owned = await transaction.resume.findFirst({
      select: { id: true },
      where: { id: resumeId, userId },
    });
    if (!owned) return;
    await transaction.resume.updateMany({
      data: { isDefault: false },
      where: { userId },
    });
    await transaction.resume.update({
      data: { isDefault: true },
      where: { id: resumeId },
    });
  });
  revalidatePath("/resumes");
}

export async function deleteResumeAction(
  resumeId: string,
  _state: ResumeActionState,
  _formData: FormData,
): Promise<ResumeActionState> {
  void _state;
  void _formData;
  const userId = await requireUserId("/resumes");
  const result = await prisma.$transaction(async (transaction) => {
    const resume = await transaction.resume.findFirst({
      select: { _count: { select: { applications: true } }, isDefault: true },
      where: { id: resumeId, userId },
    });
    if (!resume) return { outcome: "not-found" as const };
    if (resume._count.applications)
      return {
        applicationCount: resume._count.applications,
        outcome: "in-use" as const,
      };

    await transaction.resume.delete({ where: { id: resumeId } });
    if (resume.isDefault) {
      const replacement = await transaction.resume.findFirst({
        orderBy: { updatedAt: "desc" },
        select: { id: true },
        where: { userId },
      });
      if (replacement)
        await transaction.resume.update({
          data: { isDefault: true },
          where: { id: replacement.id },
        });
    }
    return { outcome: "deleted" as const };
  });

  if (result.outcome === "not-found")
    return { message: "CV record not found.", status: "error" };
  if (result.outcome === "in-use")
    return {
      message: `This CV is assigned to ${result.applicationCount} application${result.applicationCount === 1 ? "" : "s"}. Reassign them before deleting it.`,
      status: "error",
    };
  revalidatePath("/resumes");
  return { message: "CV record deleted.", status: "idle" };
}
