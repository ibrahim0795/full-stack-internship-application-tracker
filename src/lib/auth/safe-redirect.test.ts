import { describe, expect, it } from "vitest";

import { getSafeRedirectPath } from "./safe-redirect";

describe("getSafeRedirectPath", () => {
  it("keeps internal routes with query strings", () => {
    expect(getSafeRedirectPath("/dashboard?view=week")).toBe(
      "/dashboard?view=week",
    );
  });

  it.each([
    "https://malicious.example",
    "//malicious.example/dashboard",
    "javascript:alert(1)",
  ])("rejects unsafe redirect %s", (value) => {
    expect(getSafeRedirectPath(value)).toBe("/dashboard");
  });
});
