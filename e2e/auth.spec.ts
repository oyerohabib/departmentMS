import { test, expect } from "@playwright/test";
import { loginAs, loginWithCredentials, logout } from "./helpers/auth";
import { fixtures, TEST_PASSWORD } from "./fixtures/users";

test.describe("Authentication", () => {
  test("rejects invalid credentials", async ({ page }) => {
    await loginWithCredentials(page, fixtures.student.email, "wrong-password");
    await expect(page.getByText(/invalid|failed|error|incorrect/i).first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page).toHaveURL(/\/login/);
  });

  test("student can login, refresh, and logout", async ({ page }) => {
    await loginAs(page, "student");
    await page.reload();
    await expect(
      page.getByText(new RegExp(`Welcome,\\s*${fixtures.student.name}`))
    ).toBeVisible({ timeout: 15000 });
    await logout(page);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("can register a new student then login", async ({ page }) => {
    const email = `e2e.student.${Date.now()}@campusconnect.com`;
    await page.goto("/register");
    await page.getByLabel("Full Name").fill("E2E Student");
    await page.getByLabel("Email address").fill(email);
    await page.locator("#password").fill(TEST_PASSWORD);
    await page.locator("#confirmPassword").fill(TEST_PASSWORD);
    await page.locator("#role").selectOption("student");
    await page.getByRole("button", { name: /create account/i }).click();

    // Signup currently does not set a session; land on login (or bounce from dashboard).
    await page.goto("/login");
    await loginWithCredentials(page, email, TEST_PASSWORD);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20000 });
    await expect(page.getByText(/Welcome,\s*E2E Student/)).toBeVisible({
      timeout: 15000,
    });
  });
});
