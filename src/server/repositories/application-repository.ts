import "server-only";

import type { ApplicationStage, PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { ownedWhere } from "@/server/repositories/owned-where";

export type ApplicationDatabase = Pick<PrismaClient, "application">;

export function createApplicationRepository(
  database: ApplicationDatabase = prisma,
) {
  return {
    findById(userId: string, applicationId: string) {
      return database.application.findFirst({
        include: {
          contacts: true,
          notes: { orderBy: { createdAt: "desc" } },
          resume: true,
          tags: { include: { tag: true } },
        },
        where: ownedWhere(userId, { id: applicationId }),
      });
    },

    list(userId: string) {
      return database.application.findMany({
        orderBy: { updatedAt: "desc" },
        where: ownedWhere(userId, {}),
      });
    },

    updateStage(
      userId: string,
      applicationId: string,
      stage: ApplicationStage,
    ) {
      return database.application.updateMany({
        data: { stage },
        where: ownedWhere(userId, { id: applicationId }),
      });
    },

    remove(userId: string, applicationId: string) {
      return database.application.deleteMany({
        where: ownedWhere(userId, { id: applicationId }),
      });
    },
  };
}

export const applicationRepository = createApplicationRepository();
