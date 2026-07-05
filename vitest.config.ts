import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "server-only": path.resolve(__dirname, "tests/server-only-stub.ts"),
    },
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
