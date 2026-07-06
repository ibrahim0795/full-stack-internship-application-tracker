import type { ResumeFormValues } from "./resume-schema";

export const emptyResumeValues: ResumeFormValues = {
  fileUrl: "",
  isDefault: false,
  mimeType: "",
  name: "",
  originalFilename: "",
  sizeBytes: "",
  targetRole: "",
};

export function resumeDefaults(resume: {
  fileUrl: string | null;
  isDefault: boolean;
  mimeType: string | null;
  name: string;
  originalFilename: string | null;
  sizeBytes: number | null;
  targetRole: string | null;
}): ResumeFormValues {
  return {
    fileUrl: resume.fileUrl ?? "",
    isDefault: resume.isDefault,
    mimeType:
      resume.mimeType === "application/pdf" ||
      resume.mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ? resume.mimeType
        : "",
    name: resume.name,
    originalFilename: resume.originalFilename ?? "",
    sizeBytes: resume.sizeBytes?.toString() ?? "",
    targetRole: resume.targetRole ?? "",
  };
}
