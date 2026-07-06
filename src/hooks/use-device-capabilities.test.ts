import { describe, expect, it } from "vitest";

import { isConstrainedDevice } from "./use-device-capabilities";

describe("isConstrainedDevice", () => {
  it("keeps the full experience for capable devices", () => {
    expect(isConstrainedDevice({ cores: 8, memory: 8 })).toBe(false);
  });

  it.each([
    { cores: 2, memory: 8 },
    { cores: 8, memory: 2 },
    { cores: 8, memory: 8, saveData: true },
    { cores: 8, effectiveType: "2g", memory: 8 },
  ])("uses the lightweight path for constrained conditions", (input) => {
    expect(isConstrainedDevice(input)).toBe(true);
  });
});
