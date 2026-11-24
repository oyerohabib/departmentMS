# Baseline environment

Fill measured runtime fields when you record the pre-GraphQL baseline on a machine with MongoDB + k6.

| Field | Value |
|-------|-------|
| Git branch | `baseline/performance-and-testing` |
| Git commit | _(after tag: `git rev-parse pre-graphql-baseline`)_ |
| Git tag | `pre-graphql-baseline` |
| Date (UTC) | 2026-11-24 (tooling landed; numbers pending local run) |
| Machine | Developer workstation |
| OS | macOS (darwin) |
| Node.js | 24.x |
| MongoDB | local / Atlas **test** DB via `MONGODB_URI_TEST` — **not** production Render |
| Backend | `npm run build && npm start` on port 4000 |
| Frontend | `npm run build && npm start` on port 3000 |
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:4000/api` |
| k6 version | _(install from https://k6.io/docs/get-started/installation/)_ |
| Playwright | `@playwright/test` (root `package.json`) |
| Lighthouse | `lighthouse` + `@lhci/cli` (root) |
| Notes | Do not stress-test Vercel/Render. Use `USE_TEST_DB=1 npm run prepare-test-db` first. |

## How to capture numbers

```bash
# 1. Seed isolated DB
cd backend && cp -n .env.example .env   # then set MONGODB_URI_TEST
USE_TEST_DB=1 npm run prepare-test-db

# 2. Production-like servers (two terminals)
cd backend && npm run build && MONGODB_URI="$MONGODB_URI_TEST" npm start
cd frontend && npm run build && npm start

# 3. From repo root
npm run baseline:run
BASE_URL=http://127.0.0.1:4000 npm run test:load:smoke
BASE_URL=http://127.0.0.1:4000 npm run test:load:normal
```

Then copy metrics into `summary.md`.
