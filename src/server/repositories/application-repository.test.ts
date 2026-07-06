import { ApplicationStage } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import {
  createApplicationRepository,
  type ApplicationDatabase,
} from "./application-repository";

function createDatabaseDouble() {
  return {
    application: {
      deleteMany: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
  };
}

describe("applicationRepository", () => {
  it("scopes reads to both application and user", async () => {
    const database = createDatabaseDouble();
    const repository = createApplicationRepository(
      database as unknown as ApplicationDatabase,
    );

    await repository.findById("user-1", "application-1");

    expect(database.application.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "application-1", userId: "user-1" },
      }),
    );
  });

  it("scopes stage changes and deletion to the owner", async () => {
    const database = createDatabaseDouble();
    const repository = createApplicationRepository(
      database as unknown as ApplicationDatabase,
    );

    await repository.updateStage(
      "user-1",
      "application-1",
      ApplicationStage.APPLIED,
    );
    await repository.remove("user-1", "application-1");

    expect(database.application.updateMany).toHaveBeenCalledWith({
      data: { stage: ApplicationStage.APPLIED },
      where: { id: "application-1", userId: "user-1" },
    });
    expect(database.application.deleteMany).toHaveBeenCalledWith({
      where: { id: "application-1", userId: "user-1" },
    });
  });

  it("keeps list filters inside the owner scope", async () => {
    const database = createDatabaseDouble();
    const repository = createApplicationRepository(
      database as unknown as ApplicationDatabase,
    );

    await repository.list("user-1", {
      query: "orbit",
      stage: ApplicationStage.INTERVIEW,
    });

    expect(database.application.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.any(Array),
          stage: ApplicationStage.INTERVIEW,
          userId: "user-1",
        }),
      }),
    );
  });
});
