# Baseline environment

| Field | Value |
|-------|-------|
| Git branch | `baseline/performance-and-testing` |
| Git tag | `pre-graphql-baseline` |
| Date (UTC) | 2026-11-24 |
| Machine | Oyeros-MacBook-Pro |
| OS | macOS 27.0.1 (darwin) |
| Node.js | v24.11.1 |
| MongoDB | local `mongodb://127.0.0.1:27017/departmentms_test` |
| Backend | `npm run build && MONGODB_URI=…/departmentms_test npm start` on port 4000 |
| Frontend | `npm run build && npm start` on port 3000 |
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:4000/api` |
| Frontend origin | `http://127.0.0.1:3000` |
| k6 | v2.4.0 |
| Playwright | 1.65.1 |
| Lighthouse | 12.8.2 |
| Notes | CORS allows `127.0.0.1`. API uses seeded `departmentms_test`. k6 smoke/normal/elevated captured with that setup (normal re-run after seed alignment). |

## Capture commands used

```bash
USE_TEST_DB=1 npm run prepare-test-db   # from backend/
FRONTEND_URL=http://127.0.0.1:3000 API_URL=http://127.0.0.1:4000 npm run test:e2e
FRONTEND_URL=http://127.0.0.1:3000 npm run lighthouse
FRONTEND_URL=http://127.0.0.1:3000 API_URL=http://127.0.0.1:4000 npm run lighthouse:auth
BASE_URL=http://127.0.0.1:4000 npm run test:load:smoke
BASE_URL=http://127.0.0.1:4000 npm run test:load:normal
BASE_URL=http://127.0.0.1:4000 npm run test:load:elevated
```
