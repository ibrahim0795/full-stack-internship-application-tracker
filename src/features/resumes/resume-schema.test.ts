import { describe, expect, it } from "vitest";

import { resumeFormSchema } from "./resume-schema";

const validResume = {
  fileUrl: "https://example.com/cv.pdf",
  isDefault: true,
  mimeType: "application/pdf" as const,
  name: "Frontend internship CV",
  originalFilename: "frontend-cv.pdf",
  sizeBytes: "125000",
  targetRole: "Frontend developer",
};

describe("resumeFormSchema", () => {
  it("accepts supported CV metadata", () => {
    expect(resumeFormSchema.safeParse(validResume).success).toBe(true);
  });

  it("rejects unsafe URLs, unsupported formats, and files over 20 MB", () => {
    expect(
      resumeFormSchema.safeParse({
        ...validResume,
        fileUrl: "javascript:alert(1)",
        mimeType: "image/png",
        sizeBytes: "20000001",
      }).success,
    ).toBe(false);
  });

  it("allows a metadata-only CV record", () => {
    expect(
      resumeFormSchema.safeParse({
        ...validResume,
        fileUrl: "",
        mimeType: "",
        originalFilename: "",
        sizeBytes: "",
      }).success,
    ).toBe(true);
  });
});
