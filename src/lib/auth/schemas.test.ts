import { describe, expect, it } from "vitest";

import {
  loginSchema,
  registrationSchema,
  resetPasswordSchema,
} from "./schemas";

describe("authentication validation", () => {
  it("normalizes login email addresses", () => {
    const result = loginSchema.parse({
      email: "  Student@Example.COM ",
      password: "anything",
    });

    expect(result.email).toBe("student@example.com");
  });

  it("accepts a strong registration", () => {
    const result = registrationSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "CareerOrbit42",
      confirmPassword: "CareerOrbit42",
    });

    expect(result.success).toBe(true);
  });

  it("rejects weak or mismatched registration passwords", () => {
    const weak = registrationSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "short",
      confirmPassword: "different",
    });

    expect(weak.success).toBe(false);
    if (!weak.success) {
      expect(weak.error.flatten().fieldErrors.password).toBeDefined();
      expect(weak.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });

  it("requires a valid reset token", () => {
    const result = resetPasswordSchema.safeParse({
      token: "not-a-token",
      password: "CareerOrbit42",
      confirmPassword: "CareerOrbit42",
    });

    expect(result.success).toBe(false);
  });
});
