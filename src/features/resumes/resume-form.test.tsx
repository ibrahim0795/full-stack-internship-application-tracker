import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { emptyResumeValues } from "./resume-defaults";
import { ResumeForm } from "./resume-form";
import type { ResumeActionState } from "./resume-state";

function actionMock() {
  return vi.fn(async (state: ResumeActionState, formData: FormData) => {
    void state;
    void formData;
    return { status: "idle" } as const;
  });
}

afterEach(cleanup);

describe("ResumeForm", () => {
  it("blocks invalid metadata before calling the server action", async () => {
    const action = actionMock();
    const user = userEvent.setup();
    render(
      <ResumeForm
        action={action}
        defaultValues={emptyResumeValues}
        submitLabel="Create CV"
      />,
    );

    await user.type(screen.getByLabelText(/^CV name/), "A");
    fireEvent.submit(
      screen.getByRole("button", { name: "Create CV" }).closest("form")!,
    );

    expect(await screen.findByText("Enter a CV name.")).toBeVisible();
    expect(action).not.toHaveBeenCalled();
  });

  it("submits normalized form data for a valid CV", async () => {
    const action = actionMock();
    const user = userEvent.setup();
    render(
      <ResumeForm
        action={action}
        defaultValues={emptyResumeValues}
        submitLabel="Create CV"
      />,
    );

    await user.type(screen.getByLabelText(/^CV name/), "Backend internship CV");
    await user.type(screen.getByLabelText("Target role"), "Backend developer");
    await user.click(screen.getByLabelText(/^Default CV/));
    await user.click(screen.getByRole("button", { name: "Create CV" }));

    expect(action).toHaveBeenCalledOnce();
    const formData = action.mock.calls[0]?.[1] as FormData;
    expect(formData.get("name")).toBe("Backend internship CV");
    expect(formData.get("isDefault")).toBe("on");
  });
});
