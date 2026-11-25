import { defineConfig, devices } from "@playwright/test";
import path from "path";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:3000";
const API_URL = process.env.API_URL || "http://127.0.0.1:4000";
const BENCHMARK_DIR = process.env.BENCHMARK_DIR || "benchmarks/baseline";

export default defineConfig({
  testDir: path.join(__dirname, "e2e"),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: `${BENCHMARK_DIR}/functional/playwright-report` }],
    ["json", { outputFile: `${BENCHMARK_DIR}/functional/results.json` }],
  ],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: FRONTEND_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    extraHTTPHeaders: {
      // unused; API base is asserted separately in API tests
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  metadata: {
    apiUrl: API_URL,
  },
});
