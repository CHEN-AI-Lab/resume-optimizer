import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "cd apps/web && npx next dev -p 3000",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
