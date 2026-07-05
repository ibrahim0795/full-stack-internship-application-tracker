import { expect, test } from "@playwright/test";

test("foundation page is available", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /navigate your path to the right opportunity/i,
    }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/CareerOrbit/);
});
