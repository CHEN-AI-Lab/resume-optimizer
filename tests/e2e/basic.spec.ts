import { test, expect } from "@playwright/test";

test.describe("Resume Optimizer — E2E", () => {
  test("landing page loads in zh-CN", async ({ page }) => {
    await page.goto("/zh-CN");
    await expect(page.locator("h1")).toBeVisible();
    // Check Chinese text exists
    await expect(page.locator("text=简历")).toBeVisible();
  });

  test("landing page loads in en", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("language switch works", async ({ page }) => {
    await page.goto("/zh-CN");
    // Click language switcher
    const switcher = page.locator("button, select").filter({ hasText: /中|EN|Language/ }).first();
    if (await switcher.isVisible()) {
      await switcher.click();
      // Verify URL changed
      await expect(page).toHaveURL(/\/en/);
    }
  });
});
