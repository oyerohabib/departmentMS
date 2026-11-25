#!/usr/bin/env node
/**
 * Orchestrates a baseline capture assuming services are already running:
 *   frontend: http://127.0.0.1:3000 (next start)
 *   backend:  http://127.0.0.1:4000
 *   DB seeded via: USE_TEST_DB=1 npm run prepare-test-db
 *
 * Runs: Playwright → Lighthouse (public) → auth timings → prints next steps for k6.
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function run(cmd, args, opts = {}) {
  console.log(`\n> ${cmd} ${args.join(" ")}\n`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
    ...opts,
  });
  if (result.status !== 0) {
    console.error(`Command failed with exit ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

for (const dir of [
  "benchmarks/baseline/functional",
  "benchmarks/baseline/frontend",
  "benchmarks/baseline/backend",
]) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}

run("npx", ["playwright", "test"]);
run("node", ["scripts/lighthouse-baseline.mjs"]);
run("node", ["scripts/lighthouse-auth.mjs"]);

console.log(`
Baseline functional + frontend capture complete.

Next (requires k6 installed: https://k6.io/docs/get-started/installation/):
  BASE_URL=http://127.0.0.1:4000 npm run test:load:smoke
  BASE_URL=http://127.0.0.1:4000 npm run test:load:normal
  BASE_URL=http://127.0.0.1:4000 npm run test:load:elevated

Then fill benchmarks/baseline/summary.md and tag:
  git tag pre-graphql-baseline
`);
