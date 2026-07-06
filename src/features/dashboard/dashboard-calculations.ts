import { ApplicationStage, InterviewOutcome } from "@prisma/client";

export interface DashboardApplication {
  applicationDate: Date | null;
  closingDate: Date | null;
  companyName: string;
  createdAt: Date;
  id: string;
  interviews: { id: string; outcome: InterviewOutcome; scheduledAt: Date }[];
  positionTitle: string;
  stage: ApplicationStage;
  updatedAt: Date;
}

export interface DashboardAction {
  href: string;
  id: string;
  label: string;
  reason: string;
  urgency: "high" | "normal";
}

const stageOrder = Object.values(ApplicationStage);
const submittedStages = new Set<ApplicationStage>([
  ApplicationStage.APPLIED,
  ApplicationStage.ASSESSMENT,
  ApplicationStage.INTERVIEW,
  ApplicationStage.OFFER,
  ApplicationStage.REJECTED,
  ApplicationStage.WITHDRAWN,
]);
const completedStages = new Set<ApplicationStage>([
  ApplicationStage.OFFER,
  ApplicationStage.REJECTED,
  ApplicationStage.WITHDRAWN,
]);

function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86_400_000);
}

function percentage(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 100) : 0;
}

function isSubmitted(application: DashboardApplication) {
  return (
    Boolean(application.applicationDate) ||
    submittedStages.has(application.stage)
  );
}

export function calculateDashboard(
  applications: DashboardApplication[],
  now = new Date(),
) {
  const today = startOfUtcDay(now);
  const weekStart = addDays(today, -6);
  const upcomingLimit = addDays(today, 14);
  const submitted = applications.filter(isSubmitted);
  const interviewed = submitted.filter(
    (application) =>
      application.interviews.length > 0 ||
      application.stage === ApplicationStage.INTERVIEW ||
      application.stage === ApplicationStage.OFFER,
  );
  const offers = submitted.filter(
    (application) => application.stage === ApplicationStage.OFFER,
  );

  const allDeadlines = applications
    .filter(
      (application) =>
        application.closingDate && !completedStages.has(application.stage),
    )
    .map((application) => ({
      companyName: application.companyName,
      date: application.closingDate!,
      href: `/applications/${application.id}`,
      id: application.id,
      overdue: application.closingDate! < today,
      positionTitle: application.positionTitle,
    }))
    .filter((deadline) => deadline.overdue || deadline.date <= upcomingLimit)
    .sort((left, right) => {
      if (left.overdue && right.overdue)
        return right.date.getTime() - left.date.getTime();
      if (left.overdue !== right.overdue) return left.overdue ? -1 : 1;
      return left.date.getTime() - right.date.getTime();
    });
  const deadlines = allDeadlines.slice(0, 5);

  const interviews = applications
    .flatMap((application) =>
      application.interviews
        .filter((interview) => interview.outcome === InterviewOutcome.PENDING)
        .map((interview) => ({
          companyName: application.companyName,
          date: interview.scheduledAt,
          href: `/applications/${application.id}`,
          id: interview.id,
          positionTitle: application.positionTitle,
        })),
    )
    .filter(
      (interview) => interview.date >= now && interview.date <= upcomingLimit,
    )
    .sort((left, right) => left.date.getTime() - right.date.getTime())
    .slice(0, 5);

  const statusData = stageOrder.map((stage) => ({
    count: applications.filter((application) => application.stage === stage)
      .length,
    stage,
  }));

  const timeline = Array.from({ length: 8 }, (_, index) => {
    const start = addDays(weekStart, (index - 7) * 7);
    const end = addDays(start, 7);
    return {
      count: applications.filter((application) => {
        const date = application.applicationDate ?? application.createdAt;
        return date >= start && date < end;
      }).length,
      label: start.toLocaleDateString("en", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
    };
  });

  const actions: DashboardAction[] = [];
  for (const deadline of deadlines.filter((item) => item.overdue).slice(0, 2)) {
    actions.push({
      href: deadline.href,
      id: `deadline-${deadline.id}`,
      label: `Review ${deadline.companyName}`,
      reason: "The recorded closing date has passed.",
      urgency: "high",
    });
  }
  for (const interview of interviews.slice(0, 2)) {
    actions.push({
      href: interview.href,
      id: `interview-${interview.id}`,
      label: `Prepare for ${interview.companyName}`,
      reason: `Interview on ${interview.date.toLocaleDateString()}.`,
      urgency: "high",
    });
  }
  for (const application of applications
    .filter((item) => item.stage === ApplicationStage.SAVED)
    .slice(0, 2)) {
    actions.push({
      href: `/applications/${application.id}`,
      id: `saved-${application.id}`,
      label: `Decide next step for ${application.companyName}`,
      reason: "This opportunity is still saved.",
      urgency: "normal",
    });
  }
  if (!applications.length) {
    actions.push({
      href: "/applications/new",
      id: "create-first",
      label: "Add your first opportunity",
      reason: "Start tracking your search in one place.",
      urgency: "normal",
    });
  }

  return {
    actions: actions.slice(0, 4),
    deadlines,
    interviews,
    metrics: {
      interviewRate: percentage(interviewed.length, submitted.length),
      offerRate: percentage(offers.length, submitted.length),
      submittedThisWeek: submitted.filter((application) => {
        const date = application.applicationDate ?? application.createdAt;
        return date >= weekStart && date <= now;
      }).length,
      total: applications.length,
      upcomingDeadlines: allDeadlines.filter((deadline) => !deadline.overdue)
        .length,
      upcomingInterviews: interviews.length,
    },
    recent: [...applications]
      .sort(
        (left, right) => right.updatedAt.getTime() - left.updatedAt.getTime(),
      )
      .slice(0, 5),
    statusData,
    timeline,
  };
}
