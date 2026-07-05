import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "./password";

describe("password helpers", () => {
  it("hashes and verifies a password without storing the original", async () => {
    const password = "CareerOrbit42";
    const passwordHash = await hashPassword(password);

    expect(passwordHash).not.toBe(password);
    await expect(verifyPassword(password, passwordHash)).resolves.toBe(true);
    await expect(verifyPassword("WrongPassword42", passwordHash)).resolves.toBe(
      false,
    );
  });

  it("fails closed for a malformed hash", async () => {
    await expect(verifyPassword("CareerOrbit42", "invalid")).resolves.toBe(
      false,
    );
  });
});
