import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";
import { seededCourseTitle } from "./fixtures/users";

test.describe("Student workflows", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "student");
  });

  test("views dashboard and browses courses", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
    await page.getByRole("link", { name: /^courses$/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/courses/);
    await expect(page.getByRole("heading", { name: /all courses/i })).toBeVisible();
    await expect(page.getByText(seededCourseTitle).first()).toBeVisible({
      timeout: 15000,
    });
  });

  test("searches, enrolls, and disenrolls", async ({ page }) => {
    await page.goto("/dashboard/courses");
    await expect(page.getByText(seededCourseTitle).first()).toBeVisible({
      timeout: 15000,
    });

    await page
      .getByPlaceholder(/search courses/i)
      .fill("Cybersecurity Fundamentals");
    await expect(page.getByText("Cybersecurity Fundamentals").first()).toBeVisible();

    const card = page.locator("div.bg-white.rounded-lg.shadow").filter({
      hasText: "Cybersecurity Fundamentals",
    });

    const enrollBtn = card.getByRole("button", { name: /^enroll$/i });
    if (await enrollBtn.isVisible().catch(() => false)) {
      await enrollBtn.click();
      await expect(card.getByRole("button", { name: /^disenroll$/i })).toBeVisible({
        timeout: 10000,
      });
    }

    await card.getByRole("button", { name: /^disenroll$/i }).click();
    await expect(card.getByRole("button", { name: /^enroll$/i })).toBeVisible({
      timeout: 10000,
    });
  });

  test("opens enrolled course details and materials", async ({ page }) => {
    await page.goto("/dashboard");
    const viewLink = page.getByRole("link", { name: /view course/i }).first();
    await expect(viewLink).toBeVisible({ timeout: 15000 });
    await viewLink.click();
    await expect(page).toHaveURL(/\/dashboard\/courses\/[a-f0-9]+/);
    await expect(page.getByRole("heading").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /materials/i }).or(page.getByText(/materials/i)).first()
    ).toBeVisible();
  });
});
