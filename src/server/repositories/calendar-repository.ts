import "server-only";

import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export type CalendarDatabase = Pick<
  PrismaClient,
  "application" | "reminder" | "user"
>;

export function createCalendarRepository(database: CalendarDatabase = prisma) {
  return {
    async getSource(userId: string) {
      const [applications, reminders, user] = await Promise.all([
        database.application.findMany({
          select: {
            closingDate: true,
            companyName: true,
            id: true,
            interviews: {
              select: {
                followUpAt: true,
                id: true,
                outcome: true,
                scheduledAt: true,
              },
            },
            positionTitle: true,
            stage: true,
          },
          where: { userId },
        }),
        database.reminder.findMany({
          orderBy: { dueAt: "asc" },
          select: {
            applicationId: true,
            completedAt: true,
            dueAt: true,
            id: true,
            interview: { select: { applicationId: true } },
            title: true,
            type: true,
          },
          where: { userId },
        }),
        database.user.findUnique({
          select: { timezone: true },
          where: { id: userId },
        }),
      ]);
      return { applications, reminders, timezone: user?.timezone ?? "UTC" };
    },
  };
}

export const calendarRepository = createCalendarRepository();
