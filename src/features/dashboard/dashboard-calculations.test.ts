import { ApplicationStage } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

import { calculateDashboard } from "./dashboard-calculations";
import {
  dashboardApplication,
  pendingInterview,
  resetFactorySequence,
} from "@/test/factories";

const now = new Date("2026-07-06T12:00:00.000Z");

describe("calculateDashboard", () => {
  beforeEach(resetFactorySequence);
  it("calculates owner-data metrics, rates, and upcoming work", () => {
    const result = calculateDashboard(
      [
        dashboardApplication({
          closingDate: new Date("2026-07-05T12:00:00.000Z"),
          id: "saved",
          stage: ApplicationStage.SAVED,
        }),
        dashboardApplication({
          applicationDate: new Date("2026-07-02T12:00:00.000Z"),
          closingDate: new Date("2026-07-10T12:00:00.000Z"),
          id: "interview",
          interviews: [pendingInterview({ id: "interview-1" })],
          stage: ApplicationStage.INTERVIEW,
        }),
        dashboardApplication({
          applicationDate: new Date("2026-06-20T12:00:00.000Z"),
          id: "offer",
          stage: ApplicationStage.OFFER,
          updatedAt: new Date("2026-07-06T10:00:00.000Z"),
        }),
      ],
      now,
    );

    expect(result.metrics).toEqual({
      interviewRate: 100,
      offerRate: 50,
      submittedThisWeek: 1,
      total: 3,
      upcomingDeadlines: 1,
      upcomingInterviews: 1,
    });
    expect(result.deadlines.some((deadline) => deadline.overdue)).toBe(true);
    expect(result.interviews).toHaveLength(1);
    expect(result.actions[0]?.urgency).toBe("high");
    expect(result.recent[0]?.id).toBe("offer");
    expect(result.timeline.reduce((total, item) => total + item.count, 0)).toBe(
      3,
    );
  });

  it("returns safe zero rates and onboarding guidance for an empty workspace", () => {
    const result = calculateDashboard([], now);

    expect(result.metrics.interviewRate).toBe(0);
    expect(result.metrics.offerRate).toBe(0);
    expect(result.metrics.total).toBe(0);
    expect(result.actions).toEqual([
      expect.objectContaining({
        href: "/applications/new",
        id: "create-first",
      }),
    ]);
    expect(result.statusData.every((item) => item.count === 0)).toBe(true);
  });

  it("does not count saved or preparing records in conversion-rate denominators", () => {
    const result = calculateDashboard(
      [
        dashboardApplication({ id: "saved", stage: ApplicationStage.SAVED }),
        dashboardApplication({
          id: "preparing",
          stage: ApplicationStage.PREPARING,
        }),
      ],
      now,
    );

    expect(result.metrics.interviewRate).toBe(0);
    expect(result.metrics.offerRate).toBe(0);
  });
});
