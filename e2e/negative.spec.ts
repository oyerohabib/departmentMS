import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Negative / validation", () => {
  test("lecturer cannot create course with empty required fields", async ({
    page,
  }) => {
    await loginAs(page, "lecturer");
    await page.goto("/dashboard/courses/new");
    await page.getByRole("button", { name: /create course/i }).click();
    // HTML5 required attributes keep us on the form
    await expect(page).toHaveURL(/\/dashboard\/courses\/new/);
    await expect(page.getByLabel("Course Title")).toBeFocused();
  });

  test("register rejects mismatched passwords", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Full Name").fill("Mismatch User");
    await page.getByLabel("Email address").fill(`mismatch.${Date.now()}@test.com`);
    await page.locator("#password").fill("password");
    await page.locator("#confirmPassword").fill("different");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });
});
