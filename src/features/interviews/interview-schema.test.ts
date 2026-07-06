import { describe, expect, it } from "vitest";
import { interviewFormSchema } from "./interview-schema";

const validInterview = {
  applicationId: "application-1",
  followUpAt: "",
  format: "VIDEO",
  interviewerEmail: "person@example.com",
  interviewerName: "Ada",
  interviewerRole: "Engineering Manager",
  locationOrLink: "https://example.com/meeting",
  notes: "Prepare project examples.",
  outcome: "PENDING",
  scheduledAt: "2026-07-10T10:00:00.000Z",
  timezone: "Asia/Karachi",
} as const;

describe("interviewFormSchema", () => {
  it("accepts a complete interview record", () => {
    expect(interviewFormSchema.safeParse(validInterview).success).toBe(true);
  });
  it("rejects invalid dates and interviewer email", () => {
    const result = interviewFormSchema.safeParse({
      ...validInterview,
      interviewerEmail: "invalid",
      scheduledAt: "not-a-date",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.interviewerEmail).toBeDefined();
      expect(result.error.flatten().fieldErrors.scheduledAt).toBeDefined();
    }
  });
});
