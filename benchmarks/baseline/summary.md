# Pre-GraphQL baseline summary

Recorded **2026-11-24** on local production builds. Compare to `benchmarks/post-graphql/summary.md` after Apollo migration.

## Functional (Playwright)

| Measurement | Before (REST) | After (GraphQL) |
|-------------|---------------|-----------------|
| E2E pass rate | **19/19 (100%)** | |
| Failed scenarios | 0 | |
| Suite duration | ~46.7 s | |

Artifacts: `functional/results.json`

## Frontend performance

Lighthouse lab metrics (public / cold URL loads). Authenticated wall times from Playwright (JWT in localStorage).

| Measurement | Before (REST) | After (GraphQL) |
|-------------|---------------|-----------------|
| `/` LCP (ms) | 3682 | |
| `/` TTFB (ms) | 1.8 | |
| `/` TBT (ms) | 339 | |
| `/` performance score | 0.76 | |
| `/` transfer size (bytes) | 362662 | |
| `/` network requests | 21 | |
| `/login` LCP (ms) | 2789 | |
| `/dashboard` wall load (ms, auth) | 1524 | |
| `/dashboard/courses` wall load (ms, auth) | 1561 | |
| `/dashboard/profile` wall load (ms, auth) | 1466 | |
| `/dashboard/users` wall load (ms, auth) | 1662 | |

Artifacts: `frontend/summary.json`, `frontend/auth-summary.json`

## Backend load (k6)

| Measurement | Smoke (1–2 VUs) | Normal (5–10 VUs) | Elevated (≤25 VUs) | After (GraphQL) |
|-------------|-----------------|-------------------|--------------------|-----------------|
| http_req_duration p50 (ms) | 1.74 | 1.26 | 1.14 | |
| http_req_duration p95 (ms) | 70.86 | 70.78 | 69.77 | |
| http_req_duration p99 (ms) | 73.51 | 76.83 | 72.30 | |
| http_reqs | 320 | 3104 | 5139 | |
| Error rate | **0%** | **0%** | **10.6%** (545× status `0`, 4594× `200`) | |

Artifacts: `backend/k6-*-summary.json` (raw multi‑MB dumps gitignored)

## Interpretation notes

- GraphQL is not automatically faster; watch resolver N+1 and payload size.
- Elevated profile shows some connection drops under higher concurrency — useful guardrail for post-GraphQL comparison.
- Keep DB fixtures, hardware, and warm/cold conditions consistent across runs.
