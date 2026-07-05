import { describe, expect, it } from "vitest";

import { ownedWhere } from "./owned-where";

describe("ownedWhere", () => {
  it("always scopes a filter to the authenticated user", () => {
    expect(ownedWhere("user-1", { id: "application-1" })).toEqual({
      id: "application-1",
      userId: "user-1",
    });
  });

  it("cannot be overridden by an input user ID", () => {
    expect(ownedWhere("owner", { id: "record", userId: "attacker" })).toEqual({
      id: "record",
      userId: "owner",
    });
  });

  it("rejects missing ownership context", () => {
    expect(() => ownedWhere("  ", { id: "record" })).toThrow(
      "An authenticated user ID is required.",
    );
  });
});
