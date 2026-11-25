#!/usr/bin/env node
/**
 * Creates Playwright storage state for authenticated Lighthouse / reuse.
 * Requires frontend + backend running with seeded fixtures.
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:3000";
const email = process.env.STUDENT_EMAIL || "alice.williams@campusconnect.com";
const password = process.env.STUDENT_PASSWORD || "password";
const outDir = path.join(root, "e2e/.auth");
const outFile = path.join(outDir, "student.json");

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`${FRONTEND_URL}/login`);
await page.getByLabel("Email address").fill(email);
await page.getByLabel("Password", { exact: true }).fill(password);
await page.getByRole("button", { name: /sign in/i }).click();
await page.waitForURL(/\/dashboard/, { timeout: 20000 });
await page.context().storageState({ path: outFile });
await browser.close();
console.log(`Wrote ${outFile}`);
