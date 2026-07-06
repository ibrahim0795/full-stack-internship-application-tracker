import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { KanbanBoard, type BoardApplication } from "./kanban-board";

const application: BoardApplication = {
  closingDate: "2026-08-01T12:00:00.000Z",
  companyName: "Orbit Systems",
  id: "application-1",
  positionTitle: "Junior Developer",
  stage: "SAVED",
  tags: [{ displayName: "TypeScript", id: "tag-1" }],
  workArrangement: "REMOTE",
};

afterEach(cleanup);

describe("KanbanBoard", () => {
  it("persists an explicit stage move", async () => {
    const user = userEvent.setup();
    const moveStage = vi.fn().mockResolvedValue({ success: true });
    render(<KanbanBoard applications={[application]} moveStage={moveStage} />);

    await user.selectOptions(screen.getByLabelText("Move to stage"), "APPLIED");

    expect(moveStage).toHaveBeenCalledWith("application-1", "APPLIED");
    expect(await screen.findByLabelText("Move to stage")).toHaveValue(
      "APPLIED",
    );
    expect(screen.getByText(/moved to applied/i)).toBeInTheDocument();
  });

  it("rolls back the optimistic move when persistence fails", async () => {
    const user = userEvent.setup();
    const moveStage = vi.fn().mockResolvedValue({
      message: "The stage change could not be saved.",
      success: false,
    });
    render(<KanbanBoard applications={[application]} moveStage={moveStage} />);

    await user.selectOptions(
      screen.getByLabelText("Move to stage"),
      "INTERVIEW",
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The stage change could not be saved.",
    );
    expect(screen.getByLabelText("Move to stage")).toHaveValue("SAVED");
  });

  it("filters the visible cards by search text", async () => {
    const user = userEvent.setup();
    render(
      <KanbanBoard
        applications={[application]}
        moveStage={vi.fn().mockResolvedValue({ success: true })}
      />,
    );

    await user.type(
      screen.getByPlaceholderText("Search company or role"),
      "missing",
    );

    expect(screen.queryByText("Orbit Systems")).not.toBeInTheDocument();
  });
});
