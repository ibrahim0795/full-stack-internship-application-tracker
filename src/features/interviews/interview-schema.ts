import { InterviewFormat, InterviewOutcome } from "@prisma/client";
import { z } from "zod";

export const interviewFormSchema = z.object({
  applicationId: z.string().min(1, "Select an application."),
  followUpAt: z
    .string()
    .refine(
      (value) => !value || !Number.isNaN(new Date(value).getTime()),
      "Choose a valid follow-up date.",
    ),
  format: z.enum(InterviewFormat),
  interviewerEmail: z.union([
    z.literal(""),
    z.email("Enter a valid email address."),
  ]),
  interviewerName: z.string().trim().max(100),
  interviewerRole: z.string().trim().max(120),
  locationOrLink: z.string().trim().max(2_000),
  notes: z.string().trim().max(10_000),
  outcome: z.enum(InterviewOutcome),
  scheduledAt: z
    .string()
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "Choose a valid interview date and time.",
    ),
  timezone: z.string().trim().min(1).max(80),
});

export type InterviewFormValues = z.infer<typeof interviewFormSchema>;

export const interviewFormatLabels: Record<InterviewFormat, string> = {
  LIVE_CODING: "Live coding",
  ON_SITE: "On-site",
  OTHER: "Other",
  PHONE: "Phone",
  TAKE_HOME: "Take-home assessment",
  VIDEO: "Video",
};

export const interviewOutcomeLabels: Record<InterviewOutcome, string> = {
  CANCELLED: "Cancelled",
  FAILED: "Not progressed",
  PASSED: "Progressed",
  PENDING: "Pending",
};
