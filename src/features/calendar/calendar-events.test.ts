import {
  ApplicationStage,
  InterviewOutcome,
  ReminderType,
} from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  buildCalendarEvents,
  calendarDays,
  dateKeyInTimezone,
  monthKey,
  parseCalendarMonth,
} from "./calendar-events";

describe("calendar event aggregation", () => {
  it("combines active deadlines, pending interviews, follow-ups, and reminders", () => {
    const events = buildCalendarEvents(
      [
        {
          closingDate: new Date("2026-07-10T12:00:00.000Z"),
          companyName: "Orbit Systems",
          id: "application-1",
          interviews: [
            {
              followUpAt: new Date("2026-07-13T12:00:00.000Z"),
              id: "interview-1",
              outcome: InterviewOutcome.PENDING,
              scheduledAt: new Date("2026-07-12T12:00:00.000Z"),
            },
          ],
          positionTitle: "Junior Developer",
          stage: ApplicationStage.INTERVIEW,
        },
      ],
      [
        {
          applicationId: "application-1",
          completedAt: null,
          dueAt: new Date("2026-07-09T12:00:00.000Z"),
          id: "reminder-1",
          interview: null,
          title: "Prepare examples",
          type: ReminderType.CUSTOM,
        },
      ],
    );

    expect(events.map((event) => event.kind)).toEqual([
      "reminder",
      "deadline",
      "interview",
      "follow-up",
    ]);
    expect(
      events.every((event) => event.href === "/applications/application-1"),
    ).toBe(true);
  });

  it("excludes deadlines from completed application stages and canceled interviews", () => {
    const events = buildCalendarEvents(
      [
        {
          closingDate: new Date("2026-07-10T12:00:00.000Z"),
          companyName: "Orbit Systems",
          id: "application-1",
          interviews: [
            {
              followUpAt: null,
              id: "interview-1",
              outcome: InterviewOutcome.CANCELLED,
              scheduledAt: new Date("2026-07-12T12:00:00.000Z"),
            },
          ],
          positionTitle: "Junior Developer",
          stage: ApplicationStage.REJECTED,
        },
      ],
      [],
    );

    expect(events).toEqual([]);
  });
});

describe("calendar month helpers", () => {
  it("validates month query values and creates a six-week grid", () => {
    const month = parseCalendarMonth("2026-07");

    expect(monthKey(month)).toBe("2026-07");
    expect(calendarDays(month)).toHaveLength(42);
    expect(
      monthKey(parseCalendarMonth("invalid", new Date("2026-08-03"))),
    ).toBe("2026-08");
  });

  it("groups event instants by the configured timezone", () => {
    const instant = new Date("2026-07-06T22:30:00.000Z");

    expect(dateKeyInTimezone(instant, "UTC")).toBe("2026-07-06");
    expect(dateKeyInTimezone(instant, "Asia/Karachi")).toBe("2026-07-07");
  });
});
