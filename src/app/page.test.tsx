import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home", () => {
  it("keeps all seven journey chapters available as accessible HTML", () => {
    const { container } = render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /navigate your path to the right opportunity/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /job search should not feel like debris/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /bring every opportunity into one orbit/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /complete career command centre/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /saved role to signed offer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /see momentum/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /next opportunity is already out there/i,
      }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("[data-scene]")).toHaveLength(7);
  });
});
