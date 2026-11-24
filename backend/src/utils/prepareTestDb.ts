/**
 * Clears and reseeds an isolated MongoDB for E2E / load / Lighthouse baselines.
 *
 * Usage (from backend/):
 *   USE_TEST_DB=1 MONGODB_URI_TEST=mongodb://127.0.0.1:27017/departmentms_test \
 *     npm run prepare-test-db
 *
 * Known fixture accounts (password: "password"):
 *   admin@campusconnect.com
 *   john.smith@campusconnect.com (lecturer)
 *   alice.williams@campusconnect.com (student)
 */
import { spawnSync } from "child_process";
import path from "path";
import dotenv from "dotenv";

// Load backend/.env before reading MONGODB_URI_TEST (shell exports are not required)
dotenv.config({ path: path.join(__dirname, "../../.env") });

const env = {
  ...process.env,
  USE_TEST_DB: process.env.USE_TEST_DB || "1",
  NODE_ENV: process.env.NODE_ENV || "test",
};

if (!process.env.MONGODB_URI_TEST && !process.env.MONGODB_URI) {
  console.error(
    "Set MONGODB_URI_TEST (preferred) or MONGODB_URI in backend/.env before preparing the test DB."
  );
  process.exit(1);
}

const run = (script: string) => {
  const result = spawnSync("npx", ["ts-node", script], {
    cwd: path.join(__dirname, "../.."),
    env,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

console.log("Preparing test database (clear → seed → link materials)...");
run("src/utils/clearDatabase.ts");
run("src/utils/seedDatabase.ts");
run("src/utils/updateCourseSchema.ts");
console.log("Test database ready.");
