import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4317",
    headless: true,
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  reporter: [["list"]],
  webServer: {
    command: "node --import tsx scripts/e2e-server.ts",
    env: { PORT: "4317", NODE_ENV: "development", STUDY_OFFLINE: "1" },
    url: "http://127.0.0.1:4317/healthz",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
