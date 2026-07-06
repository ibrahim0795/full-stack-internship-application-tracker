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

test("authentication entry points are usable", async ({ page }) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();

  await page.getByRole("link", { name: "Create an account" }).click();
  await expect(
    page.getByRole("heading", { name: "Create your CareerOrbit" }),
  ).toBeVisible();
});

test("dashboard redirects unauthenticated visitors to login", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  const currentUrl = new URL(page.url());
  expect(currentUrl.searchParams.get("callbackUrl")).toBe(
    "http://localhost:3000/dashboard",
  );
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
});

test("applications redirect unauthenticated visitors to login", async ({
  page,
}) => {
  await page.goto("/applications");

  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  const currentUrl = new URL(page.url());
  expect(currentUrl.searchParams.get("callbackUrl")).toBe(
    "http://localhost:3000/applications",
  );
});

test("kanban redirects unauthenticated visitors to login", async ({ page }) => {
  await page.goto("/kanban");

  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  const currentUrl = new URL(page.url());
  expect(currentUrl.searchParams.get("callbackUrl")).toBe(
    "http://localhost:3000/kanban",
  );
});
