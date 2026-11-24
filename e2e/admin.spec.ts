import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Admin workflows", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
  });

  test("views users list", async ({ page }) => {
    await page.getByRole("link", { name: /^users$/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/users/);
    await expect(page.getByRole("heading", { name: /all users/i })).toBeVisible();
    await expect(page.getByText("admin@campusconnect.com")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("alice.williams@campusconnect.com")).toBeVisible();
  });

  test("views courses on dashboard", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
    await expect(page.getByText(/total courses/i)).toBeVisible();
  });
});
