import { describe, expect, it } from "vitest";

import { resolveResumeStorage } from "./storage";

describe("resolveResumeStorage", () => {
  it("prefers a managed object when both references exist", () => {
    expect(
      resolveResumeStorage({
        fileUrl: "https://example.com/cv.pdf",
        storageKey: "users/1/cv.pdf",
      }),
    ).toEqual({ key: "users/1/cv.pdf", kind: "managed-object" });
  });

  it("distinguishes external and metadata-only records", () => {
    expect(
      resolveResumeStorage({
        fileUrl: "https://example.com/cv.pdf",
        storageKey: null,
      }),
    ).toEqual({ kind: "external-url", url: "https://example.com/cv.pdf" });
    expect(resolveResumeStorage({ fileUrl: null, storageKey: null })).toEqual({
      kind: "metadata-only",
    });
  });
});
