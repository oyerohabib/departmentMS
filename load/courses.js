/**
 * k6 load script for departmentMS REST API (baseline).
 *
 * Profiles via LOAD_PROFILE env:
 *   smoke     — 1–2 VUs
 *   normal    — 5–10 VUs (default)
 *   elevated  — 20–25 VUs
 *
 * Required env:
 *   BASE_URL=http://127.0.0.1:4000
 *   STUDENT_EMAIL / STUDENT_PASSWORD
 *   ADMIN_EMAIL / ADMIN_PASSWORD (optional; enables /api/users)
 */
import http from "k6/http";
import { check, group, sleep } from "k6";
import { Trend, Rate } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:4000";
const STUDENT_EMAIL = __ENV.STUDENT_EMAIL || "alice.williams@campusconnect.com";
const STUDENT_PASSWORD = __ENV.STUDENT_PASSWORD || "password";
const ADMIN_EMAIL = __ENV.ADMIN_EMAIL || "admin@campusconnect.com";
const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || "password";
const PROFILE = (__ENV.LOAD_PROFILE || "normal").toLowerCase();

const loginDuration = new Trend("login_duration");
const coursesDuration = new Trend("courses_duration");
const courseDetailDuration = new Trend("course_detail_duration");
const errorRate = new Rate("errors");

const profiles = {
  smoke: {
    stages: [
      { duration: "10s", target: 1 },
      { duration: "20s", target: 2 },
      { duration: "10s", target: 0 },
    ],
  },
  normal: {
    stages: [
      { duration: "20s", target: 5 },
      { duration: "40s", target: 10 },
      { duration: "20s", target: 0 },
    ],
  },
  elevated: {
    stages: [
      { duration: "20s", target: 15 },
      { duration: "40s", target: 25 },
      { duration: "20s", target: 0 },
    ],
  },
};

export const options = {
  stages: (profiles[PROFILE] || profiles.normal).stages,
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<2000"],
    errors: ["rate<0.05"],
  },
};

function authHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

function login(email, password) {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { "Content-Type": "application/json" } }
  );
  loginDuration.add(res.timings.duration);
  const ok = check(res, {
    "login status 200": (r) => r.status === 200,
    "login has token": (r) => {
      try {
        return !!r.json("data.token");
      } catch {
        return false;
      }
    },
  });
  errorRate.add(!ok);
  return ok ? res.json("data.token") : null;
}

export default function () {
  const token = login(STUDENT_EMAIL, STUDENT_PASSWORD);
  if (!token) {
    sleep(1);
    return;
  }

  group("courses list", () => {
    const res = http.get(`${BASE_URL}/api/courses`, authHeaders(token));
    coursesDuration.add(res.timings.duration);
    const ok = check(res, { "GET /courses 200": (r) => r.status === 200 });
    errorRate.add(!ok);

    let courseId = null;
    try {
      const data = res.json("data");
      if (Array.isArray(data) && data.length > 0) {
        courseId = data[0]._id;
      }
    } catch {
      // ignore parse errors; metrics still recorded
    }

    if (courseId) {
      group("course detail + related", () => {
        const detail = http.get(
          `${BASE_URL}/api/courses/${courseId}`,
          authHeaders(token)
        );
        courseDetailDuration.add(detail.timings.duration);
        errorRate.add(
          !check(detail, { "GET /courses/:id 200": (r) => r.status === 200 })
        );

        const students = http.get(
          `${BASE_URL}/api/courses/${courseId}/students`,
          authHeaders(token)
        );
        errorRate.add(
          !check(students, {
            "GET /courses/:id/students 200": (r) => r.status === 200,
          })
        );

        const materials = http.get(
          `${BASE_URL}/api/materials/${courseId}`,
          authHeaders(token)
        );
        errorRate.add(
          !check(materials, {
            "GET /materials/:courseId 200": (r) => r.status === 200,
          })
        );
      });
    }

    const enrolled = http.get(
      `${BASE_URL}/api/courses/students`,
      authHeaders(token)
    );
    errorRate.add(
      !check(enrolled, {
        "GET /courses/students 200": (r) => r.status === 200,
      })
    );
  });

  // Light admin probe (once per VU iteration when credentials work)
  const adminToken = login(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (adminToken) {
    const users = http.get(`${BASE_URL}/api/users`, authHeaders(adminToken));
    errorRate.add(
      !check(users, { "GET /users (admin) 200": (r) => r.status === 200 })
    );
  }

  sleep(1);
}
