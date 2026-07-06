export interface InterviewActionState {
  fieldErrors?: Record<string, string[]>;
  message?: string;
  status: "error" | "idle";
}

export const initialInterviewState: InterviewActionState = { status: "idle" };
