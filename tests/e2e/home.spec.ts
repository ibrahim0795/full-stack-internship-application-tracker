import { expect, test } from "@playwright/test";

test("all seven scroll chapters remain available as HTML", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /navigate your path to the right opportunity/i,
    }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/CareerOrbit/);
  await expect(page.locator("[data-scene]")).toHaveCount(7);

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
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

test("manual reduced-motion preference persists", async ({ page }) => {
  await page.goto("/");

  const reduceMotion = page.getByRole("button", { name: "Reduce motion" });
  await reduceMotion.click();
  await expect(
    page.getByRole("button", { name: "Enable motion" }),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Enable motion" }),
  ).toBeVisible();
});
