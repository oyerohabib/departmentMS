# <img src="docs/logo.png" alt="Campus connect" width="36" height="36" /> Department Management System

## Overview

A comprehensive web application for managing academic departments, including courses, materials, and user management with different roles (students, lecturers, and admins).

The Department Management System (DMS) is designed to streamline educational operations by providing a platform for course management, student enrollment, learning materials distribution, and administrative tasks. The application features role-based access controls and a responsive user interface.

Courses are served over **GraphQL** (Apollo Server + Apollo Client). Auth, users, and materials remain on **REST**.

## Live Applications

- Frontend: <https://department-ms.vercel.app/>
- API: <https://departmentms-1.onrender.com/>
- GraphQL: `POST /graphql` on the API host (JWT Bearer)

## Documentation

- [Frontend Documentation](https://github.com/oyerohabib/departmentMS/blob/main/frontend/README.md)
- [Backend Documentation](https://github.com/oyerohabib/departmentMS/blob/main/backend/README.md)
- [Testing & performance](./TESTING.md) (Playwright, Lighthouse, k6 — REST baseline + GraphQL After)
- Benchmarks: [`benchmarks/baseline/`](./benchmarks/baseline/summary.md) · [`benchmarks/post-graphql/`](./benchmarks/post-graphql/summary.md)

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
