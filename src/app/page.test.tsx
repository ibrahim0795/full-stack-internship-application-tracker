import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home", () => {
  it("introduces the product and its connected workflow", () => {
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
        name: /less application chaos/i,
      }),
    ).toBeInTheDocument();
    for (const link of screen.getAllByRole("link", {
      name: /explore the system/i,
    })) {
      expect(link).toHaveAttribute("href", "#features");
    }
  });
});
