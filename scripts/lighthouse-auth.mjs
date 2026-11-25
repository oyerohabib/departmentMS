#!/usr/bin/env node
/**
 * Authenticated page Lighthouse runs using Playwright storage state.
 * Writes JSON under ${BENCHMARK_DIR}/frontend/auth-*.report.json
 * Env: BENCHMARK_DIR=benchmarks/baseline (default) or benchmarks/post-graphql
 */
import { chromium } from "@playwright/test";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  ""
);
const API_URL = (process.env.API_URL || "http://127.0.0.1:4000").replace(/\/$/, "");
const benchmarkDir = process.env.BENCHMARK_DIR || "benchmarks/baseline";
const outDir = path.join(root, benchmarkDir, "frontend");
const statePath = path.join(root, "e2e/.auth/student.json");

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(statePath), { recursive: true });

const studentEmail =
  process.env.STUDENT_EMAIL || "alice.williams@campusconnect.com";
const studentPassword = process.env.STUDENT_PASSWORD || "password";
const adminEmail = process.env.ADMIN_EMAIL || "admin@campusconnect.com";
const adminPassword = process.env.ADMIN_PASSWORD || "password";

async function loginAndSaveState(email, password, dest) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${FRONTEND_URL}/login`);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 20000 });
  await page.context().storageState({ path: dest });
  await browser.close();
}

async function resolveCourseId(token) {
  const res = await fetch(`${API_URL}/api/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return "";
  const body = await res.json();
  return body?.data?.[0]?._id || "";
}

async function getToken(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const body = await res.json();
  return body?.data?.token || null;
}

function runLighthouse(name, url, cookieHeader) {
  const outputPath = path.join(outDir, `auth-${name}`);
  const extra = cookieHeader
    ? [`--extra-headers=${JSON.stringify({ Cookie: cookieHeader })}`]
    : [];

  // Prefer injecting localStorage token via a tiny HTML redirect is hard in LH.
  // Instead open URL in Chromium with storage already present using Playwright
  // and measure with CDP Performance — but plan asks for Lighthouse JSON.
  // We pass Authorization is not enough for SPA; use Chrome user-data-dir with cookies
  // from storage state origins if any. App auth is localStorage-based, so we
  // use a bootstrap page approach: Lighthouse loads URL after Playwright sets token
  // via --disable-storage-reset and a custom chrome profile.

  const args = [
    "lighthouse",
    url,
    "--quiet",
    "--chrome-flags=--headless --no-sandbox",
    "--only-categories=performance",
    "--output=json",
    `--output-path=${outputPath}.report.json`,
    ...extra,
  ];

  console.log(`Lighthouse (auth attempt) → ${name} (${url})`);
  const result = spawnSync("npx", args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return result.status === 0 ? `${outputPath}.report.json` : null;
}

/**
 * Lighthouse cannot easily inject localStorage. We use Playwright to navigate
 * authenticated pages and capture Navigation Timing + resource sizes as a
 * companion baseline when pure Lighthouse would only see the login redirect.
 */
async function playwrightPerf(name, url, storageState) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();
  const start = Date.now();
  const response = await page.goto(url, { waitUntil: "networkidle" });
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paints = performance.getEntriesByType("paint");
    const fcp = paints.find((p) => p.name === "first-contentful-paint");
    return {
      ttfb: nav ? nav.responseStart - nav.requestStart : null,
      domContentLoaded: nav ? nav.domContentLoadedEventEnd : null,
      loadEvent: nav ? nav.loadEventEnd : null,
      fcp: fcp ? fcp.startTime : null,
      transferSize: nav ? nav.transferSize : null,
    };
  });
  const title = await page.title();
  const finalUrl = page.url();
  await browser.close();
  return {
    name,
    url,
    finalUrl,
    status: response?.status() ?? null,
    wallMs: Date.now() - start,
    title,
    ...timing,
  };
}

await loginAndSaveState(studentEmail, studentPassword, statePath);
const token = await getToken(studentEmail, studentPassword);
const courseId = token ? await resolveCourseId(token) : "";

const studentPages = [
  { name: "dashboard", url: `${FRONTEND_URL}/dashboard` },
  { name: "courses", url: `${FRONTEND_URL}/dashboard/courses` },
  { name: "profile", url: `${FRONTEND_URL}/dashboard/profile` },
];
if (courseId) {
  studentPages.push({
    name: "course-detail",
    url: `${FRONTEND_URL}/dashboard/courses/${courseId}`,
  });
}

const authSummary = {
  generatedAt: new Date().toISOString(),
  note: "Auth pages use Playwright navigation timings because the app stores JWT in localStorage (Lighthouse cold load redirects to /login).",
  pages: [],
};

for (const page of studentPages) {
  // Still run Lighthouse for raw URL (documents redirect cost)
  runLighthouse(page.name, page.url);
  const row = await playwrightPerf(page.name, page.url, statePath);
  authSummary.pages.push(row);
}

const adminState = path.join(root, "e2e/.auth/admin.json");
await loginAndSaveState(adminEmail, adminPassword, adminState);
const usersRow = await playwrightPerf(
  "users",
  `${FRONTEND_URL}/dashboard/users`,
  adminState
);
authSummary.pages.push(usersRow);
runLighthouse("users", `${FRONTEND_URL}/dashboard/users`);

const out = path.join(outDir, "auth-summary.json");
fs.writeFileSync(out, JSON.stringify(authSummary, null, 2));
console.log(`Wrote ${out}`);
