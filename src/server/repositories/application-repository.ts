import "server-only";

import type {
  ApplicationStage,
  Prisma,
  PrismaClient,
  WorkArrangement,
} from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { ownedWhere } from "@/server/repositories/owned-where";

export type ApplicationDatabase = Pick<PrismaClient, "application">;

export interface ApplicationListQuery {
  query?: string;
  sort?: "company" | "closing" | "newest" | "oldest";
  stage?: ApplicationStage;
  workArrangement?: WorkArrangement;
}

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

    list(userId: string, filters: ApplicationListQuery = {}) {
      const where: Prisma.ApplicationWhereInput = ownedWhere(userId, {
        ...(filters.stage ? { stage: filters.stage } : {}),
        ...(filters.workArrangement
          ? { workArrangement: filters.workArrangement }
          : {}),
        ...(filters.query
          ? {
              OR: [
                {
                  companyName: {
                    contains: filters.query,
                    mode: "insensitive" as const,
                  },
                },
                {
                  positionTitle: {
                    contains: filters.query,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {}),
      });
      const orderBy: Prisma.ApplicationOrderByWithRelationInput =
        filters.sort === "company"
          ? { companyName: "asc" }
          : filters.sort === "closing"
            ? { closingDate: { sort: "asc", nulls: "last" } }
            : filters.sort === "oldest"
              ? { createdAt: "asc" }
              : { updatedAt: "desc" };
      return database.application.findMany({
        include: { resume: true, tags: { include: { tag: true } } },
        orderBy,
        where,
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
