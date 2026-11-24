# Baseline testing & performance

Pre-GraphQL benchmark suite for Campus connect (`departmentMS`). Do **not** run load tests against production (Vercel / Render).

## Goals

1. Confirm role workflows work (Playwright).
2. Capture page-load metrics (Lighthouse + Playwright auth timings).
3. Capture REST API latency under load (Grafana k6).
4. Store results under `benchmarks/baseline/` for comparison after GraphQL.

## Prerequisites

- Node 20+
- Local MongoDB (or Atlas **test** cluster)
- [k6](https://k6.io/docs/get-started/installation/) installed on PATH for load tests
- Frontend + backend dependencies installed

```bash
# root (Playwright, Lighthouse)
npm install
npx playwright install chromium

# app packages
npm install --prefix backend
npm install --prefix frontend
```

## Isolated test database

Copy env examples and point test URI at a dedicated DB:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

In `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/departmentms
MONGODB_URI_TEST=mongodb://127.0.0.1:27017/departmentms_test
JWT_SECRET=local-dev-secret
FRONTEND_URL=http://localhost:3000
```

Reset fixtures (admin + lecturers + students + courses):

```bash
cd backend
USE_TEST_DB=1 npm run prepare-test-db
```

Known accounts (password `password`):

| Role     | Email                              |
|----------|------------------------------------|
| Admin    | `admin@campusconnect.com`          |
| Lecturer | `john.smith@campusconnect.com`     |
| Student  | `alice.williams@campusconnect.com` |

## Production-like local servers

Use **production builds**, not `next dev`, for performance numbers.

```bash
# terminal 1 — API (uses MONGODB_URI from backend/.env)
# For benchmarks against the test DB, set MONGODB_URI to the same value as MONGODB_URI_TEST
cd backend && npm run build && npm start

# terminal 2 — frontend
cd frontend && npm run build && npm start
```

Ensure `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:4000/api` (or `127.0.0.1`).

## Playwright E2E

```bash
# from repo root, with servers running
FRONTEND_URL=http://127.0.0.1:3000 API_URL=http://127.0.0.1:4000 npm run test:e2e
npm run test:e2e:ui
```

JSON summary: `benchmarks/baseline/functional/results.json`.

## Lighthouse

```bash
# public pages
FRONTEND_URL=http://127.0.0.1:3000 npm run lighthouse

# authenticated companion timings (localStorage JWT)
FRONTEND_URL=http://127.0.0.1:3000 API_URL=http://127.0.0.1:4000 npm run lighthouse:auth

# optional LHCI (public URLs only)
npm run lighthouse:ci
```

Outputs: `benchmarks/baseline/frontend/`.

## k6 load tests

```bash
export BASE_URL=http://127.0.0.1:4000
mkdir -p benchmarks/baseline/backend
npm run test:load:smoke
npm run test:load:normal
npm run test:load:elevated
```

## After a green baseline

1. Fill `benchmarks/baseline/environment.md` and `summary.md` with measured values.
2. Commit tooling + summary JSON (HTML reports are gitignored).
3. Tag: `git tag pre-graphql-baseline`

GraphQL work belongs on a separate branch (e.g. `feature/graphql-apollo`), with results under `benchmarks/post-graphql/`.
