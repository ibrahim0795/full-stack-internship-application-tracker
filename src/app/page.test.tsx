import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home", () => {
  it("introduces CareerOrbit and the current phase", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /navigate your path to the right opportunity/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /project foundation established/i,
      }),
    ).toBeInTheDocument();
  });
});
