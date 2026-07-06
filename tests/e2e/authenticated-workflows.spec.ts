import { expect, test } from "@playwright/test";

const hasTestDatabase = Boolean(process.env.E2E_DATABASE_URL);
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const password = "CareerOrbit-Test-2026";
let firstUser = "";
let secondUser = "";
let applicationUrl = "";

async function register(page: import("@playwright/test").Page, email: string) {
  await page.goto("/register");
  await page.getByLabel("Name").fill("CareerOrbit Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
}

async function signIn(page: import("@playwright/test").Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
}

test.describe.serial("database-backed authenticated journeys", () => {
  test.skip(
    !hasTestDatabase,
    "Set E2E_DATABASE_URL to a disposable PostgreSQL database to run authenticated journeys.",
  );

  test.beforeAll(({}, testInfo) => {
    const project = testInfo.project.name.replace(/[^a-z0-9]+/gi, "-");
    const identity = `${runId}-${project}-${testInfo.workerIndex}`;
    firstUser = `careerorbit-${identity}-one@example.com`;
    secondUser = `careerorbit-${identity}-two@example.com`;
  });

  test.beforeEach(async ({ page }, testInfo) => {
    const address = `203.0.113.${(testInfo.workerIndex % 200) + 1}`;
    await page.setExtraHTTPHeaders({ "x-forwarded-for": address });
  });

  test("registers and creates an application", async ({ page }) => {
    await register(page, firstUser);
    await page.goto("/applications/new");
    await page.getByLabel("Company name").fill("Test Orbit Labs");
    await page.getByLabel("Position title").fill("Junior Test Developer");
    await page.getByLabel("Required skills").fill("TypeScript, Playwright");
    await page.getByRole("button", { name: "Create application" }).click();

    await expect(
      page.getByRole("heading", { name: "Junior Test Developer" }),
    ).toBeVisible();
    applicationUrl = page.url();
  });

  test("edits, filters, and moves the application", async ({ page }) => {
    await signIn(page, firstUser);
    await page.goto(applicationUrl);
    await page.getByRole("link", { name: "Edit" }).click();
    await page.getByLabel("Position title").fill("Junior Full-stack Developer");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(
      page.getByRole("heading", { name: "Junior Full-stack Developer" }),
    ).toBeVisible();

    await page.goto("/applications");
    await page.getByPlaceholder("Search company or role").fill("Test Orbit");
    await page.getByRole("button", { name: "Apply" }).click();
    const applicationPath = new URL(applicationUrl).pathname;
    await expect(
      page.locator(`a[href="${applicationPath}"]:visible`),
    ).toBeVisible();

    await page.goto("/kanban");
    const applicationId = applicationPath.split("/").at(-1);
    const card = page.locator(
      `[data-application-id="${applicationId}"]:visible`,
    );
    await card.locator("select:visible").selectOption("APPLIED");
    await expect(page.getByText(/moved to applied/i)).toBeVisible();
  });

  test("prevents a second user from reading the first user's record", async ({
    page,
  }) => {
    await register(page, secondUser);
    await page.goto(applicationUrl);
    await expect(
      page.getByRole("heading", { name: "Application unavailable" }),
    ).toBeVisible();
  });

  test("allows the owner to delete the application", async ({ page }) => {
    await signIn(page, firstUser);
    await page.goto(applicationUrl);
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Delete application" }).click();
    await expect(page).toHaveURL(/\/applications$/);
    await expect(
      page.locator(`a[href="${new URL(applicationUrl).pathname}"]:visible`),
    ).not.toBeVisible();
  });
});
