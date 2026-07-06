"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createApplication,
  updateApplication,
} from "@/features/applications/application-service";
import type { ApplicationActionState } from "@/features/applications/application-state";
import {
  applicationFormSchema,
  applicationValuesFromFormData,
} from "@/features/applications/application-schema";
import { requireUserId } from "@/lib/auth/require-user";
import { prisma } from "@/lib/db/prisma";

function fieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>;
}

export async function createApplicationAction(
  _previousState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const userId = await requireUserId("/applications/new");
  const parsed = applicationFormSchema.safeParse(
    applicationValuesFromFormData(formData),
  );
  if (!parsed.success)
    return { fieldErrors: fieldErrors(parsed.error), status: "error" };

  try {
    const application = await createApplication(userId, parsed.data);
    redirect(`/applications/${application.id}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Selected CV")) {
      return { message: error.message, status: "error" };
    }
    throw error;
  }
}

export async function updateApplicationAction(
  applicationId: string,
  _previousState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const userId = await requireUserId(`/applications/${applicationId}/edit`);
  const parsed = applicationFormSchema.safeParse(
    applicationValuesFromFormData(formData),
  );
  if (!parsed.success)
    return { fieldErrors: fieldErrors(parsed.error), status: "error" };

  try {
    const updated = await updateApplication(userId, applicationId, parsed.data);
    if (!updated) return { message: "Application not found.", status: "error" };
    revalidatePath("/applications");
    redirect(`/applications/${applicationId}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Selected CV")) {
      return { message: error.message, status: "error" };
    }
    throw error;
  }
}

const noteSchema = z.object({
  body: z.string().trim().min(1, "Write a note before saving.").max(5_000),
});

export interface InlineApplicationActionState {
  fieldErrors?: Record<string, string[]>;
  message?: string;
  status: "idle" | "error" | "success";
}

export async function addApplicationNoteAction(
  applicationId: string,
  _previousState: InlineApplicationActionState,
  formData: FormData,
): Promise<InlineApplicationActionState> {
  const userId = await requireUserId(`/applications/${applicationId}`);
  const parsed = noteSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success)
    return { fieldErrors: fieldErrors(parsed.error), status: "error" };
  const application = await prisma.application.findFirst({
    select: { id: true },
    where: { id: applicationId, userId },
  });
  if (!application)
    return { message: "Application not found.", status: "error" };
  await prisma.applicationNote.create({
    data: { applicationId, body: parsed.data.body, userId },
  });
  revalidatePath(`/applications/${applicationId}`);
  return { message: "Note added.", status: "success" };
}

const contactSchema = z.object({
  email: z.union([z.literal(""), z.email("Enter a valid email address.")]),
  name: z.string().trim().min(2).max(100),
  profileUrl: z.union([
    z.literal(""),
    z
      .url("Enter a complete profile URL.")
      .refine(
        (value) => ["http:", "https:"].includes(new URL(value).protocol),
        {
          message: "Profile URL must begin with http:// or https://.",
        },
      ),
  ]),
  role: z.string().trim().max(100),
});

export async function addCompanyContactAction(
  applicationId: string,
  _previousState: InlineApplicationActionState,
  formData: FormData,
): Promise<InlineApplicationActionState> {
  const userId = await requireUserId(`/applications/${applicationId}`);
  const parsed = contactSchema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    name: formData.get("name"),
    profileUrl: String(formData.get("profileUrl") ?? "").trim(),
    role: formData.get("role"),
  });
  if (!parsed.success)
    return { fieldErrors: fieldErrors(parsed.error), status: "error" };
  const application = await prisma.application.findFirst({
    select: { id: true },
    where: { id: applicationId, userId },
  });
  if (!application)
    return { message: "Application not found.", status: "error" };
  await prisma.companyContact.create({
    data: {
      applicationId,
      email: parsed.data.email || null,
      name: parsed.data.name,
      profileUrl: parsed.data.profileUrl || null,
      role: parsed.data.role || null,
      userId,
    },
  });
  revalidatePath(`/applications/${applicationId}`);
  return { message: "Contact added.", status: "success" };
}

export async function deleteApplicationAction(applicationId: string) {
  const userId = await requireUserId(`/applications/${applicationId}`);
  await prisma.application.deleteMany({ where: { id: applicationId, userId } });
  revalidatePath("/applications");
  redirect("/applications");
}
