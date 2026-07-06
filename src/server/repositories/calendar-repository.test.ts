import { describe, expect, it, vi } from "vitest";

import {
  createCalendarRepository,
  type CalendarDatabase,
} from "./calendar-repository";

describe("calendarRepository", () => {
  it("scopes application, reminder, and timezone queries to the user", async () => {
    const database = {
      application: { findMany: vi.fn().mockResolvedValue([]) },
      reminder: { findMany: vi.fn().mockResolvedValue([]) },
      user: { findUnique: vi.fn().mockResolvedValue({ timezone: "UTC" }) },
    };
    const repository = createCalendarRepository(
      database as unknown as CalendarDatabase,
    );

    await repository.getSource("user-1");

    expect(database.application.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    );
    expect(database.reminder.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    );
    expect(database.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "user-1" } }),
    );
  });
});
