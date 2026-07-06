"use server";

import { ReminderType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUserId } from "@/lib/auth/require-user";
import { prisma } from "@/lib/db/prisma";

export interface ReminderActionState {
  fieldErrors?: Record<string, string[]>;
  message?: string;
  status: "error" | "idle" | "success";
}

const reminderSchema = z.object({
  applicationId: z.string(),
  dueAt: z
    .string()
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Choose a valid reminder date and time.",
    }),
  title: z.string().trim().min(2, "Enter a reminder title.").max(160),
});

export async function createReminderAction(
  _previousState: ReminderActionState,
  formData: FormData,
): Promise<ReminderActionState> {
  const userId = await requireUserId("/calendar");
  const parsed = reminderSchema.safeParse({
    applicationId: String(formData.get("applicationId") ?? ""),
    dueAt: String(formData.get("dueAt") ?? ""),
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
      status: "error",
    };
  }

  if (parsed.data.applicationId) {
    const application = await prisma.application.findFirst({
      select: { id: true },
      where: { id: parsed.data.applicationId, userId },
    });
    if (!application) {
      return {
        message: "Selected application was not found.",
        status: "error",
      };
    }
  }

  await prisma.reminder.create({
    data: {
      applicationId: parsed.data.applicationId || null,
      dueAt: new Date(parsed.data.dueAt),
      title: parsed.data.title,
      type: ReminderType.CUSTOM,
      userId,
    },
  });
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  return { message: "Reminder created.", status: "success" };
}

export async function setReminderCompletionAction(
  reminderId: string,
  completed: boolean,
) {
  const userId = await requireUserId("/calendar");
  await prisma.reminder.updateMany({
    data: { completedAt: completed ? new Date() : null },
    where: { id: reminderId, userId },
  });
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
}

export async function deleteReminderAction(reminderId: string) {
  const userId = await requireUserId("/calendar");
  await prisma.reminder.deleteMany({ where: { id: reminderId, userId } });
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
}
