import { expect, test } from "@playwright/test";

test("design-system landing page is available", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /navigate your path to the right opportunity/i,
    }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/CareerOrbit/);
  await expect(
    page.getByRole("heading", { name: /less application chaos/i }),
  ).toBeVisible();
});

test("navigation adapts to the active viewport", async ({ page }) => {
  await page.goto("/");

  const viewport = page.viewportSize();
  if (viewport && viewport.width < 768) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeVisible();
  } else {
    await expect(
      page.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeVisible();
  }
});
