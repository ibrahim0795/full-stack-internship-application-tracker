import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { emptyApplicationValues } from "./application-defaults";
import { ApplicationForm } from "./application-form";

describe("ApplicationForm", () => {
  it("shows client-side validation before calling the server action", async () => {
    const action = vi.fn(async () => ({ status: "idle" as const }));
    render(
      <ApplicationForm
        action={action}
        defaultValues={emptyApplicationValues}
        resumes={[]}
        submitLabel="Create application"
      />,
    );

    const button = screen.getByRole("button", { name: "Create application" });
    const form = button.closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(await screen.findByText("Enter the company name.")).toBeVisible();
    expect(screen.getByText("Enter the position title.")).toBeVisible();
    expect(action).not.toHaveBeenCalled();
  });
});
