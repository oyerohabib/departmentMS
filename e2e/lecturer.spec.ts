import { test, expect } from "@playwright/test";
import path from "path";
import { loginAs } from "./helpers/auth";

test.describe("Lecturer workflows", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "lecturer");
  });

  test("creates a course", async ({ page }) => {
    const code = `E2E${Date.now().toString().slice(-5)}`;
    await page.getByRole("link", { name: /create course/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/courses\/new/);

    await page.getByLabel("Course Title").fill(`E2E Course ${code}`);
    await page.getByLabel("Course Code").fill(code);
    await page
      .getByLabel("Course Description")
      .fill("Automated lecturer course creation for baseline suite.");
    await page.getByRole("button", { name: /create course/i }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20000 });
    await expect(page.getByText(`E2E Course ${code}`).first()).toBeVisible({
      timeout: 15000,
    });
  });

  test("updates course details and uploads material", async ({ page }) => {
    await page.goto("/dashboard");
    const viewLink = page.getByRole("link", { name: /view course/i }).first();
    await expect(viewLink).toBeVisible({ timeout: 15000 });
    await viewLink.click();
    await expect(page).toHaveURL(/\/dashboard\/courses\/[a-f0-9]+/);

    await page.getByRole("link", { name: /edit course/i }).click();
    await expect(page).toHaveURL(/\/edit/);
    const titleInput = page.getByLabel(/course title/i);
    const current = await titleInput.inputValue();
    const updated = `${current} (updated)`;
    await titleInput.fill(updated);
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page.getByText(updated).first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("link", { name: /upload new material/i }).click();
    await expect(page).toHaveURL(/\/materials\/upload/);
    await page.getByLabel("Material Title").fill("E2E Lecture Notes");
    await page
      .locator("#file-upload")
      .setInputFiles(path.join(__dirname, "fixtures/sample.pdf"));
    await page.getByRole("button", { name: /upload material/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/courses\/[a-f0-9]+$/, {
      timeout: 20000,
    });
    await expect(page.getByText("E2E Lecture Notes").first()).toBeVisible({
      timeout: 15000,
    });
  });
});
