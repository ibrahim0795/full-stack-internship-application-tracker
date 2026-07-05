import { describe, expect, it } from "vitest";

import { readServerEnvironment } from "@/lib/env";

describe("readServerEnvironment", () => {
  it("accepts a complete server environment", () => {
    expect(
      readServerEnvironment({
        DATABASE_URL: "postgresql://user:password@localhost:5432/careerorbit",
        AUTH_SECRET: "a-secure-development-secret-with-32-characters",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toMatchObject({
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
  });

  it("rejects an unsafe short authentication secret", () => {
    expect(() =>
      readServerEnvironment({
        DATABASE_URL: "postgresql://user:password@localhost:5432/careerorbit",
        AUTH_SECRET: "short",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toThrow();
  });
});
