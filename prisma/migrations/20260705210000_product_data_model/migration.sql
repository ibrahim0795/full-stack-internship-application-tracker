-- CreateEnum
CREATE TYPE "ApplicationStage" AS ENUM ('SAVED', 'PREPARING', 'APPLIED', 'ASSESSMENT', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN');
CREATE TYPE "EmploymentType" AS ENUM ('INTERNSHIP', 'PART_TIME', 'FULL_TIME', 'CONTRACT', 'FREELANCE', 'OTHER');
CREATE TYPE "WorkArrangement" AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE', 'UNSPECIFIED');
CREATE TYPE "InterviewFormat" AS ENUM ('PHONE', 'VIDEO', 'ON_SITE', 'TAKE_HOME', 'LIVE_CODING', 'OTHER');
CREATE TYPE "InterviewOutcome" AS ENUM ('PENDING', 'PASSED', 'FAILED', 'CANCELLED');
CREATE TYPE "ReminderType" AS ENUM ('DEADLINE', 'INTERVIEW', 'FOLLOW_UP', 'CUSTOM');

-- AlterTable
ALTER TABLE "users"
ADD COLUMN "theme" TEXT NOT NULL DEFAULT 'system',
ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'UTC',
ADD CONSTRAINT "users_theme_check" CHECK ("theme" IN ('light', 'dark', 'system'));

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "resume_id" TEXT,
    "company_name" TEXT NOT NULL,
    "position_title" TEXT NOT NULL,
    "job_description" TEXT,
    "job_url" TEXT,
    "employment_type" "EmploymentType" NOT NULL DEFAULT 'INTERNSHIP',
    "work_arrangement" "WorkArrangement" NOT NULL DEFAULT 'UNSPECIFIED',
    "city" TEXT,
    "country" TEXT,
    "salary_minimum" DECIMAL(12,2),
    "salary_maximum" DECIMAL(12,2),
    "currency" CHAR(3),
    "stage" "ApplicationStage" NOT NULL DEFAULT 'SAVED',
    "application_date" TIMESTAMPTZ(3),
    "closing_date" TIMESTAMPTZ(3),
    "interview_date" TIMESTAMPTZ(3),
    "personal_notes" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "applications_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "applications_salary_non_negative_check" CHECK (
      ("salary_minimum" IS NULL OR "salary_minimum" >= 0) AND
      ("salary_maximum" IS NULL OR "salary_maximum" >= 0)
    ),
    CONSTRAINT "applications_salary_range_check" CHECK (
      "salary_minimum" IS NULL OR "salary_maximum" IS NULL OR "salary_minimum" <= "salary_maximum"
    ),
    CONSTRAINT "applications_currency_check" CHECK (
      ("salary_minimum" IS NULL AND "salary_maximum" IS NULL) OR
      "currency" ~ '^[A-Z]{3}$'
    )
);

CREATE TABLE "company_contacts" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT,
    "phone" TEXT,
    "profile_url" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "company_contacts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "application_notes" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "application_notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "interviews" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMPTZ(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "format" "InterviewFormat" NOT NULL,
    "location_or_link" TEXT,
    "interviewer_name" TEXT,
    "interviewer_role" TEXT,
    "interviewer_email" TEXT,
    "outcome" "InterviewOutcome" NOT NULL DEFAULT 'PENDING',
    "follow_up_at" TIMESTAMPTZ(3),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "interview_questions" (
    "id" TEXT NOT NULL,
    "interview_id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "answer" TEXT,
    "category" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "interview_questions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "interview_questions_position_check" CHECK ("position" >= 0)
);

CREATE TABLE "checklist_items" (
    "id" TEXT NOT NULL,
    "interview_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "completed_at" TIMESTAMPTZ(3),
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "checklist_items_position_check" CHECK ("position" >= 0)
);

CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target_role" TEXT,
    "file_url" TEXT,
    "storage_key" TEXT,
    "original_filename" TEXT,
    "mime_type" TEXT,
    "size_bytes" INTEGER,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "resumes_size_bytes_check" CHECK ("size_bytes" IS NULL OR "size_bytes" >= 0)
);

CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "application_id" TEXT,
    "interview_id" TEXT,
    "type" "ReminderType" NOT NULL DEFAULT 'CUSTOM',
    "title" TEXT NOT NULL,
    "due_at" TIMESTAMPTZ(3) NOT NULL,
    "completed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "color" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "tags_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "tags_normalized_name_check" CHECK ("normalized_name" = LOWER(TRIM("normalized_name")) AND LENGTH("normalized_name") > 0)
);

CREATE TABLE "application_tags" (
    "application_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "application_tags_pkey" PRIMARY KEY ("application_id", "tag_id")
);

-- CreateIndex
CREATE INDEX "applications_user_id_stage_idx" ON "applications"("user_id", "stage");
CREATE INDEX "applications_user_id_closing_date_idx" ON "applications"("user_id", "closing_date");
CREATE INDEX "applications_user_id_interview_date_idx" ON "applications"("user_id", "interview_date");
CREATE INDEX "applications_user_id_updated_at_idx" ON "applications"("user_id", "updated_at");
CREATE INDEX "applications_resume_id_user_id_idx" ON "applications"("resume_id", "user_id");
CREATE UNIQUE INDEX "applications_id_user_id_key" ON "applications"("id", "user_id");
CREATE INDEX "company_contacts_user_id_application_id_idx" ON "company_contacts"("user_id", "application_id");
CREATE INDEX "application_notes_user_id_application_id_created_at_idx" ON "application_notes"("user_id", "application_id", "created_at");
CREATE INDEX "interviews_user_id_scheduled_at_idx" ON "interviews"("user_id", "scheduled_at");
CREATE INDEX "interviews_application_id_user_id_idx" ON "interviews"("application_id", "user_id");
CREATE UNIQUE INDEX "interviews_id_user_id_key" ON "interviews"("id", "user_id");
CREATE INDEX "interview_questions_interview_id_position_idx" ON "interview_questions"("interview_id", "position");
CREATE INDEX "checklist_items_interview_id_position_idx" ON "checklist_items"("interview_id", "position");
CREATE INDEX "resumes_user_id_updated_at_idx" ON "resumes"("user_id", "updated_at");
CREATE UNIQUE INDEX "resumes_id_user_id_key" ON "resumes"("id", "user_id");
CREATE UNIQUE INDEX "resumes_one_default_per_user_key" ON "resumes"("user_id") WHERE "is_default" = true;
CREATE INDEX "reminders_user_id_due_at_idx" ON "reminders"("user_id", "due_at");
CREATE INDEX "reminders_user_id_completed_at_due_at_idx" ON "reminders"("user_id", "completed_at", "due_at");
CREATE INDEX "reminders_application_id_user_id_idx" ON "reminders"("application_id", "user_id");
CREATE INDEX "reminders_interview_id_user_id_idx" ON "reminders"("interview_id", "user_id");
CREATE UNIQUE INDEX "tags_id_user_id_key" ON "tags"("id", "user_id");
CREATE UNIQUE INDEX "tags_user_id_normalized_name_key" ON "tags"("user_id", "normalized_name");
CREATE INDEX "application_tags_user_id_tag_id_idx" ON "application_tags"("user_id", "tag_id");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT "applications_resume_id_user_id_fkey" FOREIGN KEY ("resume_id", "user_id") REFERENCES "resumes"("id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "company_contacts" ADD CONSTRAINT "company_contacts_application_id_user_id_fkey" FOREIGN KEY ("application_id", "user_id") REFERENCES "applications"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "application_notes" ADD CONSTRAINT "application_notes_application_id_user_id_fkey" FOREIGN KEY ("application_id", "user_id") REFERENCES "applications"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_user_id_fkey" FOREIGN KEY ("application_id", "user_id") REFERENCES "applications"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_application_id_user_id_fkey" FOREIGN KEY ("application_id", "user_id") REFERENCES "applications"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_interview_id_user_id_fkey" FOREIGN KEY ("interview_id", "user_id") REFERENCES "interviews"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "application_tags" ADD CONSTRAINT "application_tags_application_id_user_id_fkey" FOREIGN KEY ("application_id", "user_id") REFERENCES "applications"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "application_tags" ADD CONSTRAINT "application_tags_tag_id_user_id_fkey" FOREIGN KEY ("tag_id", "user_id") REFERENCES "tags"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
