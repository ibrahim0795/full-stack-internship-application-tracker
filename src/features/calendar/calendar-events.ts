import {
  ApplicationStage,
  InterviewOutcome,
  ReminderType,
} from "@prisma/client";

export interface CalendarSourceApplication {
  closingDate: Date | null;
  companyName: string;
  id: string;
  interviews: {
    followUpAt: Date | null;
    id: string;
    outcome: InterviewOutcome;
    scheduledAt: Date;
  }[];
  positionTitle: string;
  stage: ApplicationStage;
}

export interface CalendarSourceReminder {
  completedAt: Date | null;
  dueAt: Date;
  id: string;
  title: string;
  type: ReminderType;
  applicationId: string | null;
  interview?: { applicationId: string } | null;
}

export interface CalendarEvent {
  completed: boolean;
  date: Date;
  href: string | null;
  id: string;
  kind: "deadline" | "follow-up" | "interview" | "reminder";
  reminderId: string | null;
  title: string;
}

export function buildCalendarEvents(
  applications: CalendarSourceApplication[],
  reminders: CalendarSourceReminder[],
) {
  const events: CalendarEvent[] = [];
  const completedStages = new Set<ApplicationStage>([
    ApplicationStage.OFFER,
    ApplicationStage.REJECTED,
    ApplicationStage.WITHDRAWN,
  ]);
  for (const application of applications) {
    if (application.closingDate && !completedStages.has(application.stage)) {
      events.push({
        completed: false,
        date: application.closingDate,
        href: `/applications/${application.id}`,
        id: `deadline-${application.id}`,
        kind: "deadline",
        reminderId: null,
        title: `${application.companyName} application deadline`,
      });
    }
    for (const interview of application.interviews) {
      if (interview.outcome === InterviewOutcome.PENDING) {
        events.push({
          completed: false,
          date: interview.scheduledAt,
          href: `/applications/${application.id}`,
          id: `interview-${interview.id}`,
          kind: "interview",
          reminderId: null,
          title: `${application.companyName} interview`,
        });
      }
      if (interview.followUpAt) {
        events.push({
          completed: false,
          date: interview.followUpAt,
          href: `/applications/${application.id}`,
          id: `follow-up-${interview.id}`,
          kind: "follow-up",
          reminderId: null,
          title: `Follow up with ${application.companyName}`,
        });
      }
    }
  }
  for (const reminder of reminders) {
    const relatedApplicationId =
      reminder.applicationId ?? reminder.interview?.applicationId;
    events.push({
      completed: Boolean(reminder.completedAt),
      date: reminder.dueAt,
      href: relatedApplicationId
        ? `/applications/${relatedApplicationId}`
        : null,
      id: `reminder-${reminder.id}`,
      kind: "reminder",
      reminderId: reminder.id,
      title: reminder.title,
    });
  }
  return events.sort(
    (left, right) => left.date.getTime() - right.date.getTime(),
  );
}

export function parseCalendarMonth(
  value: string | undefined,
  now = new Date(),
) {
  if (value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    if (year >= 2000 && year <= 2100)
      return new Date(Date.UTC(year, month - 1, 1));
  }
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function addMonths(date: Date, amount: number) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1),
  );
}

export function calendarDays(month: Date) {
  const firstDay = new Date(
    Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1),
  );
  const gridStart = new Date(firstDay);
  gridStart.setUTCDate(firstDay.getUTCDate() - firstDay.getUTCDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setUTCDate(gridStart.getUTCDate() + index);
    return date;
  });
}

export function sameUtcDay(left: Date, right: Date) {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}

export function dateKeyInTimezone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(date);
  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function utcDateKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
