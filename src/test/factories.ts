import { ApplicationStage, InterviewOutcome } from "@prisma/client";

import type { DashboardApplication } from "@/features/dashboard/dashboard-calculations";

let sequence = 0;

export function resetFactorySequence() {
  sequence = 0;
}

export function dashboardApplication(
  overrides: Partial<DashboardApplication> = {},
): DashboardApplication {
  sequence += 1;
  return {
    applicationDate: null,
    closingDate: null,
    companyName: `Company ${sequence}`,
    createdAt: new Date("2026-07-01T12:00:00.000Z"),
    id: `application-${sequence}`,
    interviews: [],
    positionTitle: "Junior Developer",
    stage: ApplicationStage.SAVED,
    updatedAt: new Date("2026-07-01T12:00:00.000Z"),
    ...overrides,
  };
}

export function pendingInterview(
  overrides: {
    id?: string;
    outcome?: InterviewOutcome;
    scheduledAt?: Date;
  } = {},
) {
  sequence += 1;
  return {
    id: overrides.id ?? `interview-${sequence}`,
    outcome: overrides.outcome ?? InterviewOutcome.PENDING,
    scheduledAt: overrides.scheduledAt ?? new Date("2026-07-08T12:00:00.000Z"),
  };
}
