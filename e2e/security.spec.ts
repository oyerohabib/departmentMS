import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";
import { fixtures, TEST_PASSWORD } from "./fixtures/users";

const API_URL = process.env.API_URL || "http://127.0.0.1:4000";

test.describe("Security / authorization", () => {
  test("student cannot open create-course UI", async ({ page }) => {
    await loginAs(page, "student");
    await page.goto("/dashboard/courses/new");
    await expect(page).not.toHaveURL(/\/dashboard\/courses\/new/, {
      timeout: 15000,
    });
  });

  test("student API cannot list all users", async ({ request }) => {
    const login = await request.post(`${API_URL}/api/auth/login`, {
      data: {
        email: fixtures.student.email,
        password: TEST_PASSWORD,
      },
    });
    expect(login.ok()).toBeTruthy();
    const body = await login.json();
    const token = body.data.token;

    const users = await request.get(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(users.status()).toBeGreaterThanOrEqual(400);
  });

  test("lecturer API cannot delete a course", async ({ request }) => {
    const login = await request.post(`${API_URL}/api/auth/login`, {
      data: {
        email: fixtures.lecturer.email,
        password: TEST_PASSWORD,
      },
    });
    expect(login.ok()).toBeTruthy();
    const body = await login.json();
    const token = body.data.token;

    const courses = await request.get(`${API_URL}/api/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(courses.ok()).toBeTruthy();
    const list = await courses.json();
    const courseId = list?.data?.[0]?._id;
    expect(courseId).toBeTruthy();

    const del = await request.delete(`${API_URL}/api/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(del.status()).toBeGreaterThanOrEqual(400);
  });

  test("invalid JWT is rejected", async ({ request }) => {
    const res = await request.get(`${API_URL}/api/courses`, {
      headers: { Authorization: "Bearer not-a-real-token" },
    });
    expect(res.status()).toBe(401);
  });
});
