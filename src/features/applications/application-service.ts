import "server-only";

import { Prisma } from "@prisma/client";

import type { ApplicationFormValues } from "./application-schema";

import { prisma } from "@/lib/db/prisma";

function optionalDate(value: string) {
  return value ? new Date(`${value}T12:00:00.000Z`) : null;
}

function optionalDecimal(value: string) {
  return value ? new Prisma.Decimal(value) : null;
}

function normalizeTags(value: string) {
  const uniqueTags = new Map<string, string>();
  for (const input of value.split(",")) {
    const displayName = input.trim().slice(0, 40);
    if (displayName) uniqueTags.set(displayName.toLowerCase(), displayName);
  }
  return [...uniqueTags.values()].slice(0, 12);
}

function applicationData(values: ApplicationFormValues) {
  return {
    applicationDate: optionalDate(values.applicationDate),
    city: values.city || null,
    closingDate: optionalDate(values.closingDate),
    companyName: values.companyName,
    country: values.country || null,
    currency: values.currency || null,
    employmentType: values.employmentType,
    interviewDate: optionalDate(values.interviewDate),
    jobDescription: values.jobDescription || null,
    jobUrl: values.jobUrl || null,
    personalNotes: values.personalNotes || null,
    positionTitle: values.positionTitle,
    resumeId: values.resumeId || null,
    salaryMaximum: optionalDecimal(values.salaryMaximum),
    salaryMinimum: optionalDecimal(values.salaryMinimum),
    stage: values.stage,
    workArrangement: values.workArrangement,
  };
}

async function replaceTags(
  transaction: Prisma.TransactionClient,
  userId: string,
  applicationId: string,
  tagNames: string[],
) {
  await transaction.applicationTag.deleteMany({
    where: { applicationId, userId },
  });

  for (const displayName of tagNames) {
    const normalizedName = displayName.toLowerCase();
    const tag = await transaction.tag.upsert({
      create: { displayName, normalizedName, userId },
      update: { displayName },
      where: { userId_normalizedName: { normalizedName, userId } },
    });
    await transaction.applicationTag.create({
      data: { applicationId, tagId: tag.id, userId },
    });
  }
}

async function verifyResumeOwnership(userId: string, resumeId: string) {
  if (!resumeId) return;
  const resume = await prisma.resume.findFirst({
    select: { id: true },
    where: { id: resumeId, userId },
  });
  if (!resume) throw new Error("Selected CV could not be found.");
}

export async function createApplication(
  userId: string,
  values: ApplicationFormValues,
) {
  await verifyResumeOwnership(userId, values.resumeId);
  return prisma.$transaction(async (transaction) => {
    const application = await transaction.application.create({
      data: { ...applicationData(values), userId },
      select: { id: true },
    });
    await replaceTags(
      transaction,
      userId,
      application.id,
      normalizeTags(values.tags),
    );
    return application;
  });
}

export async function updateApplication(
  userId: string,
  applicationId: string,
  values: ApplicationFormValues,
) {
  await verifyResumeOwnership(userId, values.resumeId);
  return prisma.$transaction(async (transaction) => {
    const updated = await transaction.application.updateMany({
      data: applicationData(values),
      where: { id: applicationId, userId },
    });
    if (!updated.count) return false;
    await replaceTags(
      transaction,
      userId,
      applicationId,
      normalizeTags(values.tags),
    );
    return true;
  });
}
