import { test, expect } from "@playwright/test";

test.describe("Public visitor", () => {
  test("landing page shows brand and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Campus connect").first()).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /transform the way your campus communicates/i,
      })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /get started/i }).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /explore the dashboard|login/i }).first()
    ).toBeVisible();
  });

  test("can navigate to login and register", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /^login$/i }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole("heading", { name: /sign in to your account/i })
    ).toBeVisible();

    await page.getByRole("link", { name: /register/i }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(
      page.getByRole("heading", { name: /create your account/i })
    ).toBeVisible();
  });

  test("unauthenticated dashboard access redirects to login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });
});
