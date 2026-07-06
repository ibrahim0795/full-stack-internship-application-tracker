export interface ApplicationActionState {
  fieldErrors?: Record<string, string[]>;
  message?: string;
  status: "idle" | "error";
}

export const initialApplicationActionState: ApplicationActionState = {
  status: "idle",
};
