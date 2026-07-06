import "server-only";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export type ResumeDatabase = Pick<PrismaClient, "resume">;

export function createResumeRepository(database: ResumeDatabase = prisma) {
  return {
    findById(userId: string, id: string) {
      return database.resume.findFirst({
        include: {
          applications: {
            orderBy: { updatedAt: "desc" },
            select: {
              companyName: true,
              id: true,
              positionTitle: true,
              stage: true,
            },
          },
        },
        where: { id, userId },
      });
    },
    list(userId: string) {
      return database.resume.findMany({
        include: {
          applications: {
            orderBy: { updatedAt: "desc" },
            select: {
              companyName: true,
              id: true,
              positionTitle: true,
              stage: true,
            },
          },
        },
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
        where: { userId },
      });
    },
  };
}

export const resumeRepository = createResumeRepository();
