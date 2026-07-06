import type { InterviewFormValues } from "./interview-schema";

import { dateTimeInputValue } from "@/lib/dates/timezone";

export function emptyInterviewValues(
  applicationId: string,
  timezone: string,
): InterviewFormValues {
  return {
    applicationId,
    followUpAt: "",
    format: "VIDEO",
    interviewerEmail: "",
    interviewerName: "",
    interviewerRole: "",
    locationOrLink: "",
    notes: "",
    outcome: "PENDING",
    scheduledAt: dateTimeInputValue(
      new Date(Date.now() + 86_400_000),
      timezone,
    ),
    timezone,
  };
}

export function interviewDefaults(interview: {
  applicationId: string;
  followUpAt: Date | null;
  format: InterviewFormValues["format"];
  interviewerEmail: string | null;
  interviewerName: string | null;
  interviewerRole: string | null;
  locationOrLink: string | null;
  notes: string | null;
  outcome: InterviewFormValues["outcome"];
  scheduledAt: Date;
  timezone: string;
}): InterviewFormValues {
  return {
    applicationId: interview.applicationId,
    followUpAt: dateTimeInputValue(interview.followUpAt, interview.timezone),
    format: interview.format,
    interviewerEmail: interview.interviewerEmail ?? "",
    interviewerName: interview.interviewerName ?? "",
    interviewerRole: interview.interviewerRole ?? "",
    locationOrLink: interview.locationOrLink ?? "",
    notes: interview.notes ?? "",
    outcome: interview.outcome,
    scheduledAt: dateTimeInputValue(interview.scheduledAt, interview.timezone),
    timezone: interview.timezone,
  };
}
