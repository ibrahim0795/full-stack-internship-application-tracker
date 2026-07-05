import {
  ApplicationStage,
  EmploymentType,
  InterviewFormat,
  PrismaClient,
  ReminderType,
  WorkArrangement,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
const demoEmail = "demo@careerorbit.dev";

function daysFrom(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

async function seed() {
  const now = new Date();
  const passwordHash = await hash("CareerOrbit42", 12);
  const user = await prisma.user.upsert({
    create: {
      email: demoEmail,
      name: "CareerOrbit Demo",
      passwordHash,
      timezone: "Asia/Karachi",
    },
    update: {
      name: "CareerOrbit Demo",
      passwordHash,
      timezone: "Asia/Karachi",
    },
    where: { email: demoEmail },
  });

  await prisma.$transaction([
    prisma.reminder.deleteMany({ where: { userId: user.id } }),
    prisma.application.deleteMany({ where: { userId: user.id } }),
    prisma.resume.deleteMany({ where: { userId: user.id } }),
    prisma.tag.deleteMany({ where: { userId: user.id } }),
  ]);

  const [typescript, react, postgresql] = await Promise.all(
    [
      ["typescript", "TypeScript", "#38bdf8"],
      ["react", "React", "#8b5cf6"],
      ["postgresql", "PostgreSQL", "#22d3ee"],
    ].map(([normalizedName, displayName, color]) =>
      prisma.tag.create({
        data: { color, displayName, normalizedName, userId: user.id },
      }),
    ),
  );

  const resume = await prisma.resume.create({
    data: {
      fileUrl: "https://example.com/demo-resume.pdf",
      isDefault: true,
      name: "Full-stack internship CV",
      targetRole: "Junior Full-stack Developer",
      userId: user.id,
    },
  });

  const application = await prisma.application.create({
    data: {
      applicationDate: daysFrom(now, -8),
      city: "Karachi",
      companyName: "Northstar Labs",
      country: "Pakistan",
      employmentType: EmploymentType.INTERNSHIP,
      interviewDate: daysFrom(now, 3),
      jobUrl: "https://example.com/jobs/full-stack-intern",
      positionTitle: "Full-stack Engineering Intern",
      resumeId: resume.id,
      stage: ApplicationStage.INTERVIEW,
      userId: user.id,
      workArrangement: WorkArrangement.HYBRID,
      contacts: {
        create: {
          email: "recruiting@example.com",
          name: "Demo Recruiter",
          role: "Talent Partner",
        },
      },
      notes: {
        create: {
          body: "Review the product workflow and prepare two API design examples.",
        },
      },
      tags: {
        create: [typescript, react, postgresql].map((tag) => ({
          tagId: tag.id,
          userId: user.id,
        })),
      },
    },
  });

  const interview = await prisma.interview.create({
    data: {
      applicationId: application.id,
      format: InterviewFormat.VIDEO,
      interviewerName: "Demo Interviewer",
      locationOrLink: "https://example.com/demo-meeting",
      scheduledAt: daysFrom(now, 3),
      timezone: "Asia/Karachi",
      userId: user.id,
      checklistItems: {
        create: [
          { label: "Research the role", position: 0 },
          { label: "Prepare project walkthrough", position: 1 },
        ],
      },
      questions: {
        create: {
          category: "Technical",
          position: 0,
          prompt: "How would you design an ownership-safe application API?",
        },
      },
    },
  });

  await prisma.application.createMany({
    data: [
      {
        closingDate: daysFrom(now, 7),
        companyName: "Orbit Systems",
        employmentType: EmploymentType.FULL_TIME,
        positionTitle: "Junior Frontend Developer",
        resumeId: resume.id,
        stage: ApplicationStage.PREPARING,
        userId: user.id,
        workArrangement: WorkArrangement.REMOTE,
      },
      {
        applicationDate: daysFrom(now, -2),
        companyName: "Signal Works",
        employmentType: EmploymentType.INTERNSHIP,
        positionTitle: "Backend Developer Intern",
        resumeId: resume.id,
        stage: ApplicationStage.APPLIED,
        userId: user.id,
        workArrangement: WorkArrangement.ON_SITE,
      },
    ],
  });

  await prisma.reminder.create({
    data: {
      dueAt: daysFrom(now, 2),
      interviewId: interview.id,
      title: "Prepare for Northstar Labs interview",
      type: ReminderType.INTERVIEW,
      userId: user.id,
    },
  });

  console.info(`Seeded demo workspace for ${demoEmail}.`);
}

seed()
  .catch((error: unknown) => {
    console.error("Database seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
