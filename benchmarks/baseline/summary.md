# Pre-GraphQL baseline summary

Recorded **2026-11-24** on local production builds. Compare to `benchmarks/post-graphql/summary.md` after Apollo migration.

## Functional (Playwright)

| Measurement | Before (REST) | After (GraphQL) |
|-------------|---------------|-----------------|
| E2E pass rate | **19/19 (100%)** | **19/19 (100%)** |
| Failed scenarios | 0 | 0 |
| Suite duration | ~46.7 s | ~42.0 s |

Artifacts: `functional/results.json` · After: `../post-graphql/functional/results.json`

## Frontend performance

Lighthouse lab metrics (public / cold URL loads). Authenticated wall times from Playwright (JWT in localStorage).

| Measurement | Before (REST) | After (GraphQL) |
|-------------|---------------|-----------------|
| `/` LCP (ms) | 3682 | 3599 |
| `/` TTFB (ms) | 1.8 | 1.8 |
| `/` TBT (ms) | 339 | 53 |
| `/` performance score | 0.76 | 0.85 |
| `/` transfer size (bytes) | 362662 | 422699 |
| `/` network requests | 21 | 24 |
| `/login` LCP (ms) | 2789 | 2994 |
| `/dashboard` wall load (ms, auth) | 1524 | 1528 |
| `/dashboard/courses` wall load (ms, auth) | 1561 | 1470 |
| `/dashboard/profile` wall load (ms, auth) | 1466 | 1584 |
| `/dashboard/users` wall load (ms, auth) | 1662 | 1540 |

Artifacts: `frontend/summary.json`, `frontend/auth-summary.json` · After: `../post-graphql/frontend/`

## Backend load (k6)

| Measurement | Smoke (REST) | Normal (REST) | Elevated (REST) | Smoke (GQL) | Normal (GQL) | Elevated (GQL) |
|-------------|--------------|---------------|-----------------|-------------|--------------|----------------|
| http_req_duration p50 (ms) | 1.74 | 1.26 | 1.14 | 2.93 | 2.60 | 2.15 |
| http_req_duration p95 (ms) | 70.86 | 70.78 | 69.77 | 78.75 | 72.79 | 70.88 |
| http_reqs | 320 | 3104 | 5139 | 168 | 1648 | 4468 |
| Error rate | **0%** | **0%** | **10.6%** | **0%** | **0%** | **0%** |

Artifacts: `backend/k6-*-summary.json` · After: `../post-graphql/backend/k6-graphql-*-summary.json`

## Interpretation notes

- GraphQL is not automatically faster; watch resolver N+1 and payload size.
- REST elevated showed connection drops under higher concurrency; GraphQL elevated stayed at 0% errors in this run.
- Keep DB fixtures, hardware, and warm/cold conditions consistent across runs.
- Apollo Client increased home transfer size / request count; auth course browse wall time stayed comparable.
