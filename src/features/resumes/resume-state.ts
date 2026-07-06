export interface ResumeActionState {
  fieldErrors?: Record<string, string[]>;
  message?: string;
  status: "error" | "idle";
}
export const initialResumeState: ResumeActionState = { status: "idle" };
