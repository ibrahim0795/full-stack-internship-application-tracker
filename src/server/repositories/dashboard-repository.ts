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
