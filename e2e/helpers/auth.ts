import { Page, expect } from "@playwright/test";
import { fixtures, TEST_PASSWORD } from "../fixtures/users";

export type FixtureRole = keyof typeof fixtures;

export async function loginAs(
  page: Page,
  role: FixtureRole = "student"
): Promise<void> {
  const account = fixtures[role];
  await page.goto("/login");
  await page.getByLabel("Email address").fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(new RegExp(`Welcome,\\s*${account.name}`))).toBeVisible({
    timeout: 15000,
  });
}

export async function loginWithCredentials(
  page: Page,
  email: string,
  password: string = TEST_PASSWORD
): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}

export async function logout(page: Page): Promise<void> {
  await page.getByRole("button", { name: /logout/i }).click();
  await expect(page).toHaveURL(/\/login/);
}
