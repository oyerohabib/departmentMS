/**
 * k6 load script for GraphQL course queries (post-migration).
 *
 * Env:
 *   BASE_URL=http://127.0.0.1:4000
 *   STUDENT_EMAIL / STUDENT_PASSWORD
 *   LOAD_PROFILE=smoke|normal|elevated|stress|stress250
 */
import http from "k6/http";
import { check, group, sleep } from "k6";
import { Trend, Rate } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:4000";
const STUDENT_EMAIL = __ENV.STUDENT_EMAIL || "alice.williams@campusconnect.com";
const STUDENT_PASSWORD = __ENV.STUDENT_PASSWORD || "password";
const PROFILE = (__ENV.LOAD_PROFILE || "normal").toLowerCase();

const gqlDuration = new Trend("graphql_duration");
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
  stress: {
    stages: [
      { duration: "30s", target: 50 },
      { duration: "60s", target: 100 },
      { duration: "30s", target: 100 },
      { duration: "20s", target: 0 },
    ],
  },
  stress250: {
    stages: [
      { duration: "30s", target: 100 },
      { duration: "60s", target: 250 },
      { duration: "40s", target: 250 },
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

function login() {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: STUDENT_EMAIL, password: STUDENT_PASSWORD }),
    { headers: { "Content-Type": "application/json" } }
  );
  const ok = check(res, { "login 200": (r) => r.status === 200 });
  errorRate.add(!ok);
  return ok ? res.json("data.token") : null;
}

function gql(token, query, variables) {
  const res = http.post(
    `${BASE_URL}/graphql`,
    JSON.stringify({ query, variables }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  gqlDuration.add(res.timings.duration);
  const ok = check(res, {
    "graphql 200": (r) => r.status === 200,
    "no graphql errors": (r) => {
      try {
        const body = r.json();
        return !body.errors;
      } catch {
        return false;
      }
    },
  });
  errorRate.add(!ok);
  return res;
}

export default function () {
  const token = login();
  if (!token) {
    sleep(1);
    return;
  }

  group("graphql courses", () => {
    const list = gql(
      token,
      `query { courses { _id title courseCode studentIds lecturer { name } } }`
    );
    let courseId = null;
    try {
      courseId = list.json("data.courses.0._id");
    } catch {
      // ignore
    }

    gql(token, `query { myCourses { _id title } }`);

    if (courseId) {
      gql(
        token,
        `query($id: ID!) { course(id: $id) { _id title students { name email } } }`,
        { id: courseId }
      );
    }
  });

  sleep(1);
}
