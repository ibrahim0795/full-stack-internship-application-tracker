import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { emptyInterviewValues } from "./interview-defaults";
import { InterviewForm } from "./interview-form";

describe("InterviewForm", () => {
  it("requires an owned application before submitting", async () => {
    const action = vi.fn(async () => ({ status: "idle" as const }));
    render(
      <InterviewForm
        action={action}
        applications={[]}
        defaultValues={emptyInterviewValues("", "UTC")}
        submitLabel="Create interview"
      />,
    );

    fireEvent.submit(
      screen.getByRole("button", { name: "Create interview" }).closest("form")!,
    );

    expect(await screen.findByText("Select an application.")).toBeVisible();
    expect(action).not.toHaveBeenCalled();
  });
});
