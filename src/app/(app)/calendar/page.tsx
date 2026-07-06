import {
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  ClockAlert,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  deleteReminderAction,
  setReminderCompletionAction,
} from "@/app/actions/reminders";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  addMonths,
  buildCalendarEvents,
  calendarDays,
  dateKeyInTimezone,
  monthKey,
  parseCalendarMonth,
  utcDateKey,
  type CalendarEvent,
} from "@/features/calendar/calendar-events";
import { ReminderForm } from "@/features/calendar/reminder-form";
import { requireUserId } from "@/lib/auth/require-user";
import { cn } from "@/lib/utils/cn";
import { calendarRepository } from "@/server/repositories/calendar-repository";

export const metadata: Metadata = { title: "Calendar" };

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const userId = await requireUserId("/calendar");
  const parameters = await searchParams;
  const selectedMonth = parseCalendarMonth(parameters.month);
  const source = await calendarRepository.getSource(userId);
  const events = buildCalendarEvents(source.applications, source.reminders);
  const now = new Date();
  const month = monthKey(selectedMonth);
  const monthEvents = events.filter(
    (event) =>
      dateKeyInTimezone(event.date, source.timezone).slice(0, 7) === month,
  );
  const overdue = events
    .filter((event) => !event.completed && event.date < now)
    .sort((left, right) => right.date.getTime() - left.date.getTime())
    .slice(0, 6);
  const upcomingLimit = new Date(now.getTime() + 30 * 86_400_000);
  const upcoming = events
    .filter(
      (event) =>
        !event.completed && event.date >= now && event.date <= upcomingLimit,
    )
    .slice(0, 8);
  const completedReminders = events
    .filter((event) => event.completed && event.reminderId)
    .slice(-5)
    .reverse();
  const applications = source.applications.map((application) => ({
    companyName: application.companyName,
    id: application.id,
    positionTitle: application.positionTitle,
  }));

  return (
    <AppShell navigation={appNavigation("calendar")} title="Calendar">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="violet">Dates and reminders</Badge>
            <h2 className="text-foreground mt-4 text-3xl font-semibold tracking-[-0.04em]">
              Plan the next move
            </h2>
            <p className="text-muted mt-2">
              Deadlines, interviews, follow-ups, and reminders in{" "}
              {source.timezone}.
            </p>
          </div>
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href={`/calendar?month=${monthKey(new Date())}`}
          >
            Today
          </Link>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_21rem]">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <Link
                aria-label="Previous month"
                className={buttonVariants({ size: "icon", variant: "ghost" })}
                href={`/calendar?month=${monthKey(addMonths(selectedMonth, -1))}`}
              >
                <ChevronLeft aria-hidden="true" size={19} />
              </Link>
              <h3 className="text-foreground text-xl font-semibold">
                {selectedMonth.toLocaleDateString("en", {
                  month: "long",
                  timeZone: "UTC",
                  year: "numeric",
                })}
              </h3>
              <Link
                aria-label="Next month"
                className={buttonVariants({ size: "icon", variant: "ghost" })}
                href={`/calendar?month=${monthKey(addMonths(selectedMonth, 1))}`}
              >
                <ChevronRight aria-hidden="true" size={19} />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="border-border bg-border hidden grid-cols-7 gap-px overflow-hidden rounded-2xl border md:grid">
                {weekdays.map((day) => (
                  <div
                    className="bg-surface-raised text-muted px-2 py-3 text-center text-xs font-semibold uppercase"
                    key={day}
                  >
                    {day}
                  </div>
                ))}
                {calendarDays(selectedMonth).map((day) => {
                  const dayEvents = monthEvents.filter(
                    (event) =>
                      dateKeyInTimezone(event.date, source.timezone) ===
                      utcDateKey(day),
                  );
                  const outsideMonth =
                    day.getUTCMonth() !== selectedMonth.getUTCMonth();
                  return (
                    <div
                      className={cn(
                        "bg-surface min-h-28 p-2",
                        outsideMonth && "opacity-45",
                      )}
                      key={day.toISOString()}
                    >
                      <time
                        className="text-muted text-xs"
                        dateTime={utcDateKey(day)}
                      >
                        {day.getUTCDate()}
                      </time>
                      <div className="mt-2 grid gap-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <CalendarEventPill event={event} key={event.id} />
                        ))}
                        {dayEvents.length > 3 ? (
                          <span className="text-muted text-[0.65rem]">
                            +{dayEvents.length - 3} more
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-3 md:hidden">
                {monthEvents.length ? (
                  monthEvents.map((event) => (
                    <EventRow
                      event={event}
                      key={event.id}
                      timeZone={source.timezone}
                    />
                  ))
                ) : (
                  <p className="text-muted py-12 text-center text-sm">
                    No events in this month.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CalendarCheck
                className="text-primary-strong"
                aria-hidden="true"
                size={22}
              />
              <h3 className="text-foreground pt-2 text-xl font-semibold">
                Create reminder
              </h3>
              <p className="text-muted text-sm">
                Add a personal follow-up or preparation task.
              </p>
            </CardHeader>
            <CardContent>
              <ReminderForm
                applications={applications}
                timezone={source.timezone}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <EventList
            empty="Nothing is overdue."
            icon={<ClockAlert />}
            title="Overdue"
          >
            {overdue.map((event) => (
              <EventRow
                event={event}
                key={event.id}
                timeZone={source.timezone}
              />
            ))}
          </EventList>
          <EventList
            empty="No events in the next 30 days."
            icon={<CalendarCheck />}
            title="Upcoming"
          >
            {upcoming.map((event) => (
              <EventRow
                event={event}
                key={event.id}
                timeZone={source.timezone}
              />
            ))}
          </EventList>
          <EventList
            empty="No completed reminders."
            icon={<Check />}
            title="Completed reminders"
          >
            {completedReminders.map((event) => (
              <EventRow
                event={event}
                key={event.id}
                timeZone={source.timezone}
              />
            ))}
          </EventList>
        </div>
      </div>
    </AppShell>
  );
}

function CalendarEventPill({ event }: { event: CalendarEvent }) {
  const className = cn(
    "block truncate rounded-md px-1.5 py-1 text-[0.65rem] font-medium",
    event.kind === "interview" && "bg-accent/15 text-accent-strong",
    event.kind === "deadline" && "bg-danger/10 text-danger",
    event.kind === "follow-up" && "bg-primary/10 text-primary-strong",
    event.kind === "reminder" && "bg-success/10 text-success",
    event.completed && "line-through opacity-60",
  );
  return event.href ? (
    <Link className={className} href={event.href}>
      {event.title}
    </Link>
  ) : (
    <span className={className}>{event.title}</span>
  );
}

function EventRow({
  event,
  timeZone,
}: {
  event: CalendarEvent;
  timeZone: string;
}) {
  const content = (
    <div className={cn("min-w-0", event.completed && "opacity-60")}>
      <div className="flex items-center gap-2">
        <Badge tone={event.kind === "interview" ? "violet" : "neutral"}>
          {event.kind}
        </Badge>
        <p
          className={cn(
            "text-foreground truncate text-sm font-semibold",
            event.completed && "line-through",
          )}
        >
          {event.title}
        </p>
      </div>
      <time
        className="text-muted mt-2 block text-xs"
        dateTime={event.date.toISOString()}
      >
        {event.date.toLocaleString("en", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone,
        })}
      </time>
    </div>
  );
  return (
    <div className="bg-surface-raised rounded-2xl p-4">
      {event.href ? (
        <Link
          className="focus-visible:outline-focus block rounded-lg focus-visible:outline-2"
          href={event.href}
        >
          {content}
        </Link>
      ) : (
        content
      )}
      {event.reminderId ? (
        <ReminderControls
          completed={event.completed}
          reminderId={event.reminderId}
        />
      ) : null}
    </div>
  );
}

function ReminderControls({
  completed,
  reminderId,
}: {
  completed: boolean;
  reminderId: string;
}) {
  const toggle = setReminderCompletionAction.bind(null, reminderId, !completed);
  const remove = deleteReminderAction.bind(null, reminderId);
  return (
    <div className="border-border mt-3 flex gap-2 border-t pt-3">
      <form action={toggle}>
        <Button size="sm" type="submit" variant="ghost">
          {completed ? (
            <RotateCcw aria-hidden="true" size={14} />
          ) : (
            <Check aria-hidden="true" size={14} />
          )}
          {completed ? "Reopen" : "Complete"}
        </Button>
      </form>
      <form action={remove}>
        <Button
          aria-label="Delete reminder"
          size="sm"
          type="submit"
          variant="ghost"
        >
          <Trash2 aria-hidden="true" size={14} /> Delete
        </Button>
      </form>
    </div>
  );
}

function EventList({
  children,
  empty,
  icon,
  title,
}: {
  children: ReactNode;
  empty: string;
  icon: ReactNode;
  title: string;
}) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);
  return (
    <Card>
      <CardHeader>
        <div className="text-primary-strong [&_svg]:size-5">{icon}</div>
        <h3 className="text-foreground pt-2 text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        {hasChildren ? (
          <div className="grid gap-3">{children}</div>
        ) : (
          <p className="text-muted py-8 text-center text-sm">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}
