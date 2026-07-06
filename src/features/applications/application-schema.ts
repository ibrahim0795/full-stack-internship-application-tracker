import {
  ApplicationStage,
  EmploymentType,
  WorkArrangement,
} from "@prisma/client";
import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(2_000)
  .refine(
    (value) => {
      if (!value) return true;
      try {
        return ["http:", "https:"].includes(new URL(value).protocol);
      } catch {
        return false;
      }
    },
    {
      message: "Enter a complete URL beginning with http:// or https://.",
    },
  );

const optionalMoney = z
  .string()
  .trim()
  .refine(
    (value) =>
      !value || (/^\d+(\.\d{1,2})?$/.test(value) && Number(value) >= 0),
    "Enter a non-negative amount with up to two decimal places.",
  );

export const applicationFormSchema = z
  .object({
    applicationDate: z.string(),
    city: z.string().trim().max(100),
    closingDate: z.string(),
    companyName: z.string().trim().min(2, "Enter the company name.").max(120),
    country: z.string().trim().max(100),
    currency: z
      .string()
      .trim()
      .toUpperCase()
      .refine((value) => !value || /^[A-Z]{3}$/.test(value), {
        message: "Use a three-letter currency such as USD or PKR.",
      }),
    employmentType: z.enum(EmploymentType),
    interviewDate: z.string(),
    jobDescription: z.string().trim().max(20_000),
    jobUrl: optionalUrl,
    personalNotes: z.string().trim().max(10_000),
    positionTitle: z
      .string()
      .trim()
      .min(2, "Enter the position title.")
      .max(160),
    resumeId: z.string(),
    salaryMaximum: optionalMoney,
    salaryMinimum: optionalMoney,
    stage: z.enum(ApplicationStage),
    tags: z.string().trim().max(500),
    workArrangement: z.enum(WorkArrangement),
  })
  .superRefine((values, context) => {
    if (
      values.salaryMinimum &&
      values.salaryMaximum &&
      Number(values.salaryMinimum) > Number(values.salaryMaximum)
    ) {
      context.addIssue({
        code: "custom",
        message: "Maximum salary must be at least the minimum salary.",
        path: ["salaryMaximum"],
      });
    }
    if ((values.salaryMinimum || values.salaryMaximum) && !values.currency) {
      context.addIssue({
        code: "custom",
        message: "Select a currency when entering salary information.",
        path: ["currency"],
      });
    }
  });

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export const applicationStageLabels: Record<ApplicationStage, string> = {
  APPLIED: "Applied",
  ASSESSMENT: "Assessment",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  PREPARING: "Preparing",
  REJECTED: "Rejected",
  SAVED: "Saved",
  WITHDRAWN: "Withdrawn",
};

export const employmentTypeLabels: Record<EmploymentType, string> = {
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  FULL_TIME: "Full time",
  INTERNSHIP: "Internship",
  OTHER: "Other",
  PART_TIME: "Part time",
};

export const workArrangementLabels: Record<WorkArrangement, string> = {
  HYBRID: "Hybrid",
  ON_SITE: "On-site",
  REMOTE: "Remote",
  UNSPECIFIED: "Unspecified",
};

export function applicationValuesFromFormData(formData: FormData) {
  const fields = [
    "applicationDate",
    "city",
    "closingDate",
    "companyName",
    "country",
    "currency",
    "employmentType",
    "interviewDate",
    "jobDescription",
    "jobUrl",
    "personalNotes",
    "positionTitle",
    "resumeId",
    "salaryMaximum",
    "salaryMinimum",
    "stage",
    "tags",
    "workArrangement",
  ] as const;

  return Object.fromEntries(
    fields.map((field) => [field, String(formData.get(field) ?? "")]),
  );
}
