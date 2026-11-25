# Post-GraphQL comparison

Recorded **2026-11-24 / 2026-11-25** on local production builds (`:3000` / `:4000`, `departmentms_test`). Artifacts under this folder.

| Measurement | Before (REST) | After (GraphQL) |
|-------------|---------------|-----------------|
| E2E pass rate | 19/19 | **19/19 (100%)** |
| Suite duration | ~46.7 s | **~42.0 s** |
| `/` LCP (ms) | 3682 | **3599** |
| `/` TTFB (ms) | 1.8 | **1.8** |
| `/` TBT (ms) | 339 | **53** |
| `/` performance score | 0.76 | **0.85** |
| `/` transfer size (bytes) | 362662 | **422699** |
| `/` network requests | 21 | **24** |
| `/login` LCP (ms) | 2789 | **2994** |
| `/dashboard` wall load (ms, auth) | 1524 | **1528** |
| `/dashboard/courses` wall load (ms, auth) | 1561 | **1470** |
| `/dashboard/profile` wall load (ms, auth) | 1466 | **1584** |
| `/dashboard/users` wall load (ms, auth) | 1662 | **1540** |
| Smoke p50 / p95 (ms) | 1.74 / 70.86 | **2.93 / 78.75** |
| Normal p50 / p95 (ms) | 1.26 / 70.78 | **2.60 / 72.79** |
| Elevated p50 / p95 (ms) | 1.14 / 69.77 | **2.15 / 70.88** |
| Smoke error rate | 0% | **0%** (168 reqs) |
| Normal error rate | 0% | **0%** (1648 reqs) |
| Elevated error rate | 10.6% | **0%** (4468 reqs) |

## Artifacts

- Functional: `functional/results.json`
- Frontend: `frontend/summary.json`, `frontend/auth-summary.json`
- Backend: `backend/k6-graphql-{smoke,normal,elevated}-summary.json`

## Notes

- Course UI is Apollo → `POST /graphql`; auth / users / materials stay on REST.
- GraphQL load mixes login + course queries; p50 is a bit higher than REST but p95 stays in the same band.
- Elevated GraphQL held **0%** errors at ≤25 VUs (REST elevated saw connection drops).
- Home transfer size / request count rose after Apollo Client landed in the bundle.
