#!/usr/bin/env node
/**
 * Run Lighthouse against a production Next.js build and write JSON under
 * benchmarks/baseline/frontend/.
 *
 * Env:
 *   FRONTEND_URL=http://127.0.0.1:3000
 *   STORAGE_STATE=e2e/.auth/student.json  (optional; for authenticated pages)
 *   COURSE_ID=<mongo id>                  (optional; for course detail page)
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "benchmarks/baseline/frontend");
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  ""
);
const COURSE_ID = process.env.COURSE_ID || "";

fs.mkdirSync(outDir, { recursive: true });

const publicPages = [
  { name: "home", url: `${FRONTEND_URL}/` },
  { name: "login", url: `${FRONTEND_URL}/login` },
  { name: "register", url: `${FRONTEND_URL}/register` },
];

const authenticatedPages = [
  { name: "dashboard", url: `${FRONTEND_URL}/dashboard` },
  { name: "courses", url: `${FRONTEND_URL}/dashboard/courses` },
  { name: "profile", url: `${FRONTEND_URL}/dashboard/profile` },
  { name: "users", url: `${FRONTEND_URL}/dashboard/users` },
];

if (COURSE_ID) {
  authenticatedPages.push({
    name: "course-detail",
    url: `${FRONTEND_URL}/dashboard/courses/${COURSE_ID}`,
  });
}

function runLighthouse(name, url, extraArgs = []) {
  const outputPath = path.join(outDir, name);
  const args = [
    "lighthouse",
    url,
    "--quiet",
    "--chrome-flags=--headless --no-sandbox",
    "--only-categories=performance",
    "--output=json",
    `--output-path=${outputPath}.report.json`,
    ...extraArgs,
  ];

  console.log(`Lighthouse → ${name} (${url})`);
  const result = spawnSync("npx", args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    console.warn(`Lighthouse failed for ${name} (exit ${result.status})`);
    return null;
  }

  const reportPath = `${outputPath}.report.json`;
  if (!fs.existsSync(reportPath)) return null;

  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const audits = report.audits || {};
  return {
    name,
    url,
    performanceScore: report.categories?.performance?.score ?? null,
    metrics: {
      FCP: audits["first-contentful-paint"]?.numericValue ?? null,
      LCP: audits["largest-contentful-paint"]?.numericValue ?? null,
      TTFB: audits["server-response-time"]?.numericValue ?? null,
      CLS: audits["cumulative-layout-shift"]?.numericValue ?? null,
      TBT: audits["total-blocking-time"]?.numericValue ?? null,
      totalByteWeight: audits["total-byte-weight"]?.numericValue ?? null,
      networkRequests: audits["network-requests"]?.details?.items?.length ?? null,
    },
  };
}

const summary = { generatedAt: new Date().toISOString(), frontendUrl: FRONTEND_URL, pages: [] };

for (const page of publicPages) {
  const row = runLighthouse(page.name, page.url);
  if (row) summary.pages.push(row);
}

const storageState = process.env.STORAGE_STATE;
if (storageState && fs.existsSync(path.resolve(root, storageState))) {
  console.log(
    "STORAGE_STATE is set; authenticated Lighthouse runs still require a logged-in Chrome profile."
  );
  console.log(
    "Prefer: npm run lighthouse:auth (Playwright opens pages + collects timings) or pass cookies via LHCI."
  );
}

// Always attempt authenticated URLs unauthenticated so failures are visible in summary.
for (const page of authenticatedPages) {
  const row = runLighthouse(page.name, page.url);
  if (row) summary.pages.push(row);
}

const summaryPath = path.join(outDir, "summary.json");
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
console.log(`Wrote ${summaryPath}`);
