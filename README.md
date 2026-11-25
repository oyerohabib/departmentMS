# <img src="docs/logo.png" alt="Campus connect" width="36" height="36" /> Department Management System

## Overview

A comprehensive web application for managing academic departments, including courses, materials, and user management with different roles (students, lecturers, and admins).

The Department Management System (DMS) is designed to streamline educational operations by providing a platform for course management, student enrollment, learning materials distribution, and administrative tasks. The application features role-based access controls and a responsive user interface.

Courses are served over **GraphQL** (Apollo Server + Apollo Client). Auth, users, and materials remain on **REST**. The repo includes a measured **Before (REST) → After (GraphQL)** performance study so visitors can see how the migration was validated, not just implemented.

## Live Applications

- Frontend: <https://department-ms.vercel.app/>
- API: <https://departmentms-1.onrender.com/>
- GraphQL: `POST /graphql` on the API host (JWT Bearer)

## Documentation

- [Frontend Documentation](https://github.com/oyerohabib/departmentMS/blob/main/frontend/README.md)
- [Backend Documentation](https://github.com/oyerohabib/departmentMS/blob/main/backend/README.md)
- [Testing & performance how-to](./TESTING.md)
- Full tables: [`benchmarks/baseline/summary.md`](./benchmarks/baseline/summary.md) · [`benchmarks/post-graphql/summary.md`](./benchmarks/post-graphql/summary.md)

## Engineering highlights

| Theme | What shipped |
|-------|----------------|
| Hybrid API | Course domain on GraphQL; auth / users / materials on REST |
| Shared backend | `course.service` used by thin REST controllers and GraphQL resolvers |
| Client | Apollo Client on dashboard/course pages; JWT Bearer on `/graphql` |
| Data loading | DataLoader for lecturer/student user lookups (avoids N+1) |
| Quality gate | Playwright E2E (19 scenarios), Lighthouse, Grafana k6 |
| Evidence | Tagged baseline (`pre-graphql-baseline`) + After artifacts under `benchmarks/` |

## Benchmarks at a glance

Local production builds against a seeded test DB (Nov 2026). Headline: **courses stayed correct and fast after GraphQL**; biggest wins were **reliability under load** and a **smoother home-page lab score**, not a dramatic single-request speedup.

| Check | Before (REST) | After (GraphQL) |
|-------|---------------|-----------------|
| E2E workflows | 19/19 | **19/19** |
| Home Lighthouse score / TBT | 0.76 / 339 ms | **0.85 / 53 ms** |
| Auth `/dashboard/courses` wall load | 1561 ms | **1470 ms** |
| k6 elevated (≤25 VUs) error rate | 10.6% | **0%** |
| Course-only latency @ 100 VUs (p50 / p95) | list ~1.6 / 2.5 ms | GraphQL ~**1.3 / 2.4 ms** |
| Course-only latency @ 250 VUs (p50 / p95) | list ~1.7 / 2.4 ms | GraphQL ~**1.1 / 2.1 ms** |

**How to read this:** mixed k6 totals include REST login; the course-only rows compare `GET /courses` vs `/graphql` query timing only. Home transfer size rose slightly after Apollo Client. Details and raw summaries live in `benchmarks/`.

Reproduce locally (API + FE production builds on `:4000` / `:3000`):

```bash
npm run test:e2e
npm run benchmark:post-graphql          # E2E + Lighthouse + GraphQL smoke
BASE_URL=http://127.0.0.1:4000 npm run test:load:stress      # 100 VUs REST
BASE_URL=http://127.0.0.1:4000 npm run test:load:graphql:stress
```

## Features

| Area | Capabilities |
|------|----------------|
| Auth | Register/login, JWT, bcrypt, roles (Student / Lecturer / Admin) |
| Courses | CRUD via GraphQL (+ REST parity), enroll/disenroll, lecturer assignment, DataLoader for users |
| Materials | Upload, download, organize by course (REST) |
| Users | Profiles, role info, update details, enrolled/teaching views |

## Technology Stack

| Layer | Stack |
|-------|--------|
| Frontend | Next.js 15, TypeScript, Tailwind, Apollo Client (courses), Axios (REST), React Toastify |
| Backend | Express, TypeScript, Apollo Server `/graphql`, MongoDB/Mongoose, DataLoader, JWT, Multer, CORS |
| Quality | Playwright E2E, Lighthouse, Grafana k6 (REST + GraphQL) |

## Screenshots

|                                                        |                                                   |
| :----------------------------------------------------: | :-----------------------------------------------: |
|   ![Landing Page](https://i.imgur.com/wdoVJFC.jpeg)    |  ![Login Page](https://i.imgur.com/AKhT6oN.jpeg)  |
|   ![Register Page](https://i.imgur.com/ZOpo4pU.jpeg)   |  ![Dashboard](https://i.imgur.com/d3IZkBU.jpeg)   |
| ![Course Management](https://i.imgur.com/AuH7OyJ.jpeg) | ![User Profile](https://i.imgur.com/lSh6g33.jpeg) |

## Future Development Roadmap

| Area | Ideas |
|------|--------|
| Admin | Bulk actions, analytics dashboard, announcements |
| Academic | Levels/semesters, prerequisites, credits, calendar |
| Platform | Swagger/GraphQL docs, social auth, rate limiting, caching |
| Student | Timetable, submissions, grades, course forums |
| Lecturer | Attendance, grading tools, assignment workflows |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT LICENSE](LICENSE).
