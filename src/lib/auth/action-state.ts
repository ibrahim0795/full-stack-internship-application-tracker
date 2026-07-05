export interface AuthActionState {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
  status: "idle" | "error" | "success";
}

export const initialAuthActionState: AuthActionState = { status: "idle" };
