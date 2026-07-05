import type { AuthActionState } from "@/lib/auth/action-state";

export function ActionMessage({ state }: { state: AuthActionState }) {
  if (!state.message) return null;

  return (
    <p
      className={
        state.status === "success"
          ? "border-success/25 bg-success/10 text-success rounded-2xl border px-4 py-3 text-sm"
          : "border-danger/25 bg-danger/10 text-danger rounded-2xl border px-4 py-3 text-sm"
      }
      role={state.status === "error" ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}
