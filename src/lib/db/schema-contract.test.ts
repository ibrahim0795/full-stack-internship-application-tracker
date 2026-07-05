// @vitest-environment node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.resolve(
  process.cwd(),
  "prisma/migrations/20260705210000_product_data_model/migration.sql",
);

describe("product database migration", () => {
  it("creates every private product table", async () => {
    const sql = await readFile(migrationPath, "utf8");
    const tables = [
      "applications",
      "company_contacts",
      "application_notes",
      "interviews",
      "interview_questions",
      "checklist_items",
      "resumes",
      "reminders",
      "tags",
      "application_tags",
    ];

    for (const table of tables) {
      expect(sql).toContain(`CREATE TABLE "${table}"`);
    }
  });

  it("keeps critical integrity and ownership constraints in SQL", async () => {
    const sql = await readFile(migrationPath, "utf8");

    expect(sql).toContain("applications_salary_range_check");
    expect(sql).toContain("applications_currency_check");
    expect(sql).toContain("resumes_one_default_per_user_key");
    expect(sql).toContain(
      'FOREIGN KEY ("resume_id", "user_id") REFERENCES "resumes"("id", "user_id")',
    );
    expect(sql).toContain(
      'FOREIGN KEY ("application_id", "user_id") REFERENCES "applications"("id", "user_id")',
    );
    expect(sql).toContain(
      'FOREIGN KEY ("tag_id", "user_id") REFERENCES "tags"("id", "user_id")',
    );
  });
});
