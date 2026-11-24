# Pre-GraphQL baseline summary

Compare these numbers to `benchmarks/post-graphql/summary.md` after the Apollo migration.

**Status:** Tooling and suites are on branch `baseline/performance-and-testing`. Populate Before (REST) columns after running `npm run baseline:run` and k6 against a local seeded stack (see `environment.md`).

## Functional (Playwright)

| Measurement | Before (REST) | After (GraphQL) |
|-------------|---------------|-----------------|
| E2E pass rate | _run `npm run test:e2e`_ | |
| Failed scenarios | | |

Suites: `e2e/public`, `auth`, `student`, `lecturer`, `admin`, `security`, `negative`  
Artifacts: `functional/results.json`

## Frontend performance

| Measurement | Before (REST) | After (GraphQL) |
|-------------|---------------|-----------------|
| `/` LCP (ms) | | |
| `/` TTFB (ms) | | |
| `/` TBT (ms) | | |
| `/login` LCP (ms) | | |
| `/dashboard` wall load (ms, auth) | | |
| `/dashboard/courses` wall load (ms, auth) | | |
| JS / transfer size (home) | | |
| Network request count (home) | | |

Artifacts: `frontend/summary.json`, `frontend/auth-summary.json`

## Backend load (k6)

| Measurement | Smoke | Normal | Elevated | After (GraphQL) |
|-------------|-------|--------|----------|-----------------|
| http_req_duration p50 | | | | |
| http_req_duration p95 | | | | |
| http_req_duration p99 | | | | |
| Requests/s | | | | |
| Error rate | | | | |

Artifacts: `backend/k6-*.json`

## Interpretation notes

- GraphQL is not automatically faster; watch resolver N+1 and payload size.
- Keep DB fixtures, hardware, and warm/cold conditions consistent across runs.
