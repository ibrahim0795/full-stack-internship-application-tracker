import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    env: {
      AUTH_SECRET:
        process.env.AUTH_SECRET ??
        "careerorbit-playwright-secret-at-least-32-characters",
      DATABASE_URL:
        process.env.E2E_DATABASE_URL ??
        process.env.DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5432/careerorbit",
      NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    },
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
