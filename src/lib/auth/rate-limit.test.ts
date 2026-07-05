import { beforeEach, describe, expect, it } from "vitest";

import { checkAuthRateLimit, clearAuthRateLimitsForTests } from "./rate-limit";

describe("authentication rate limit", () => {
  beforeEach(() => clearAuthRateLimitsForTests());

  it("blocks requests above the limit until the window resets", () => {
    const options = {
      key: "login:test",
      limit: 2,
      now: 1_000,
      windowMs: 5_000,
    };

    expect(checkAuthRateLimit(options).allowed).toBe(true);
    expect(checkAuthRateLimit(options).allowed).toBe(true);
    expect(checkAuthRateLimit(options)).toEqual({
      allowed: false,
      retryAfterSeconds: 5,
    });
    expect(checkAuthRateLimit({ ...options, now: 6_000 }).allowed).toBe(true);
  });
});
