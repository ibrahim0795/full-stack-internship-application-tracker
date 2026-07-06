import type { ApplicationFormValues } from "./application-schema";

export const emptyApplicationValues: ApplicationFormValues = {
  applicationDate: "",
  city: "",
  closingDate: "",
  companyName: "",
  country: "",
  currency: "",
  employmentType: "INTERNSHIP",
  interviewDate: "",
  jobDescription: "",
  jobUrl: "",
  personalNotes: "",
  positionTitle: "",
  resumeId: "",
  salaryMaximum: "",
  salaryMinimum: "",
  stage: "SAVED",
  tags: "",
  workArrangement: "UNSPECIFIED",
};

function dateInputValue(value: Date | null) {
  return value?.toISOString().slice(0, 10) ?? "";
}

export function applicationFormDefaults(application: {
  applicationDate: Date | null;
  city: string | null;
  closingDate: Date | null;
  companyName: string;
  country: string | null;
  currency: string | null;
  employmentType: ApplicationFormValues["employmentType"];
  interviewDate: Date | null;
  jobDescription: string | null;
  jobUrl: string | null;
  personalNotes: string | null;
  positionTitle: string;
  resumeId: string | null;
  salaryMaximum: { toString(): string } | null;
  salaryMinimum: { toString(): string } | null;
  stage: ApplicationFormValues["stage"];
  tags: { tag: { displayName: string } }[];
  workArrangement: ApplicationFormValues["workArrangement"];
}): ApplicationFormValues {
  return {
    applicationDate: dateInputValue(application.applicationDate),
    city: application.city ?? "",
    closingDate: dateInputValue(application.closingDate),
    companyName: application.companyName,
    country: application.country ?? "",
    currency: application.currency ?? "",
    employmentType: application.employmentType,
    interviewDate: dateInputValue(application.interviewDate),
    jobDescription: application.jobDescription ?? "",
    jobUrl: application.jobUrl ?? "",
    personalNotes: application.personalNotes ?? "",
    positionTitle: application.positionTitle,
    resumeId: application.resumeId ?? "",
    salaryMaximum: application.salaryMaximum?.toString() ?? "",
    salaryMinimum: application.salaryMinimum?.toString() ?? "",
    stage: application.stage,
    tags: application.tags.map(({ tag }) => tag.displayName).join(", "),
    workArrangement: application.workArrangement,
  };
}
