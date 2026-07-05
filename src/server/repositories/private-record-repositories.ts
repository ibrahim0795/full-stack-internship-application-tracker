import "server-only";

import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { ownedWhere } from "@/server/repositories/owned-where";

type PrivateRecordDatabase = Pick<
  PrismaClient,
  "interview" | "reminder" | "resume" | "tag"
>;

export function createPrivateRecordRepositories(
  database: PrivateRecordDatabase = prisma,
) {
  return {
    interviews: {
      findById: (userId: string, id: string) =>
        database.interview.findFirst({ where: ownedWhere(userId, { id }) }),
    },
    reminders: {
      list: (userId: string) =>
        database.reminder.findMany({
          orderBy: { dueAt: "asc" },
          where: ownedWhere(userId, {}),
        }),
    },
    resumes: {
      findById: (userId: string, id: string) =>
        database.resume.findFirst({ where: ownedWhere(userId, { id }) }),
    },
    tags: {
      list: (userId: string) =>
        database.tag.findMany({
          orderBy: { displayName: "asc" },
          where: ownedWhere(userId, {}),
        }),
    },
  };
}

export const privateRecordRepositories = createPrivateRecordRepositories();
