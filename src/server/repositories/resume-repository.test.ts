import { describe, expect, it, vi } from "vitest";

import {
  createResumeRepository,
  type ResumeDatabase,
} from "./resume-repository";

describe("resumeRepository", () => {
  it("scopes list and detail reads to the authenticated owner", async () => {
    const database = {
      resume: {
        findFirst: vi.fn().mockResolvedValue(null),
        findMany: vi.fn().mockResolvedValue([]),
      },
    };
    const repository = createResumeRepository(
      database as unknown as ResumeDatabase,
    );

    await repository.findById("user-1", "resume-1");
    await repository.list("user-1");

    expect(database.resume.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "resume-1", userId: "user-1" },
      }),
    );
    expect(database.resume.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    );
  });
});
