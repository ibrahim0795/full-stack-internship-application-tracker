import "server-only";

import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export type InterviewDatabase = Pick<PrismaClient, "interview">;

export function createInterviewRepository(
  database: InterviewDatabase = prisma,
) {
  return {
    findById(userId: string, id: string) {
      return database.interview.findFirst({
        include: {
          application: { select: { companyName: true, positionTitle: true } },
          checklistItems: { orderBy: { position: "asc" } },
          questions: { orderBy: { position: "asc" } },
        },
        where: { id, userId },
      });
    },
    list(userId: string) {
      return database.interview.findMany({
        include: {
          application: { select: { companyName: true, positionTitle: true } },
          checklistItems: { select: { completedAt: true, id: true } },
          questions: { select: { answer: true, id: true } },
        },
        orderBy: { scheduledAt: "asc" },
        where: { userId },
      });
    },
  };
}

export const interviewRepository = createInterviewRepository();
