import dotenv from "dotenv";

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || ".env" });

/**
 * Prefer an isolated test database when preparing or running benchmarks.
 * Never point MONGODB_URI_TEST at production (Render) data.
 */
export function getMongoUri(): string {
  const useTestDb =
    process.env.USE_TEST_DB === "1" ||
    process.env.NODE_ENV === "test" ||
    process.env.BENCHMARK === "1";

  if (useTestDb && process.env.MONGODB_URI_TEST) {
    return process.env.MONGODB_URI_TEST;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. For benchmarks/tests, set MONGODB_URI_TEST and USE_TEST_DB=1."
    );
  }
  return uri;
}
