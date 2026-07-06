import { describe, expect, it } from "vitest";
import { dateTimeInputValue, zonedDateTimeToIso } from "./timezone";

describe("timezone date conversion", () => {
  it("round-trips a Pakistan wall time through UTC", () => {
    const iso = zonedDateTimeToIso("2026-07-10T15:30", "Asia/Karachi");
    expect(iso).toBe("2026-07-10T10:30:00.000Z");
    expect(dateTimeInputValue(new Date(iso), "Asia/Karachi")).toBe(
      "2026-07-10T15:30",
    );
  });
  it("handles a daylight-saving timezone", () => {
    expect(zonedDateTimeToIso("2026-07-10T09:00", "America/New_York")).toBe(
      "2026-07-10T13:00:00.000Z",
    );
  });
});
