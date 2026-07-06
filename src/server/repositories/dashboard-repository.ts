import "server-only";

import { prisma } from "@/lib/db/prisma";

export function getDashboardApplications(userId: string) {
  return prisma.application.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      applicationDate: true,
      closingDate: true,
      companyName: true,
      createdAt: true,
      id: true,
      interviews: {
        orderBy: { scheduledAt: "asc" },
        select: { id: true, outcome: true, scheduledAt: true },
      },
      positionTitle: true,
      stage: true,
      updatedAt: true,
    },
    where: { userId },
  });
}

export function getDashboardReminders(userId: string, now = new Date()) {
  return prisma.reminder.findMany({
    orderBy: { dueAt: "asc" },
    select: {
      applicationId: true,
      dueAt: true,
      id: true,
      interview: { select: { applicationId: true } },
      title: true,
    },
    take: 5,
    where: {
      completedAt: null,
      dueAt: { lte: new Date(now.getTime() + 30 * 86_400_000) },
      userId,
    },
  });
}
