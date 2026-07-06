import { describe, expect, it, vi } from "vitest";

import {
  createInterviewRepository,
  type InterviewDatabase,
} from "./interview-repository";

describe("interviewRepository", () => {
  it("scopes list and detail reads to the authenticated owner", async () => {
    const database = {
      interview: {
        findFirst: vi.fn().mockResolvedValue(null),
        findMany: vi.fn().mockResolvedValue([]),
      },
    };
    const repository = createInterviewRepository(
      database as unknown as InterviewDatabase,
    );

    await repository.findById("user-1", "interview-1");
    await repository.list("user-1");

    expect(database.interview.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "interview-1", userId: "user-1" },
      }),
    );
    expect(database.interview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    );
  });
});
