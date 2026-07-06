import { describe, expect, it } from "vitest";

import { emptyApplicationValues } from "./application-defaults";
import { applicationFormSchema } from "./application-schema";

describe("applicationFormSchema", () => {
  const valid = {
    ...emptyApplicationValues,
    companyName: "Orbit Systems",
    positionTitle: "Junior Developer",
  };

  it("accepts a complete application and normalizes currency", () => {
    const result = applicationFormSchema.parse({
      ...valid,
      currency: "pkr",
      salaryMaximum: "120000",
      salaryMinimum: "80000",
    });

    expect(result.currency).toBe("PKR");
  });

  it("rejects an inverted salary range", () => {
    const result = applicationFormSchema.safeParse({
      ...valid,
      currency: "USD",
      salaryMaximum: "1000",
      salaryMinimum: "2000",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.salaryMaximum).toContain(
        "Maximum salary must be at least the minimum salary.",
      );
    }
  });

  it("requires currency when salary is recorded", () => {
    const result = applicationFormSchema.safeParse({
      ...valid,
      salaryMinimum: "50000",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.currency).toBeDefined();
    }
  });

  it("rejects non-web job links", () => {
    const result = applicationFormSchema.safeParse({
      ...valid,
      jobUrl: "javascript:alert(1)",
    });

    expect(result.success).toBe(false);
  });
});
