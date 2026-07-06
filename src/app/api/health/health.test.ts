import { describe, expect, it, vi } from "vitest";

import { checkHealth } from "./health";

describe("checkHealth", () => {
  it("reports readiness when PostgreSQL responds", async () => {
    const result = await checkHealth(
      vi.fn().mockResolvedValue([{ result: 1 }]),
    );

    expect(result).toEqual({
      body: { database: "reachable", service: "careerorbit", status: "ok" },
      status: 200,
    });
  });

  it("returns a safe degraded result without leaking database errors", async () => {
    const result = await checkHealth(
      vi.fn().mockRejectedValue(new Error("secret infrastructure detail")),
    );

    expect(result).toEqual({
      body: {
        database: "unreachable",
        service: "careerorbit",
        status: "degraded",
      },
      status: 503,
    });
    expect(JSON.stringify(result)).not.toContain(
      "secret infrastructure detail",
    );
  });
});
