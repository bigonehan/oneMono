import { expect, test } from "@playwright/test";

test("header sponsor link opens the sponsor landing with packages and popular posts", async ({ page }) => {
  await page.goto("/");
  await page.locator(".site-nav").getByRole("link", { name: "Sponsor", exact: true }).click();

  await expect(page).toHaveURL(/\/sponsor$/);
  await expect(page.getByRole("heading", { name: "Three clear options" })).toBeVisible();
  await expect(page.locator(".package-card")).toHaveCount(3);
  await expect(page.locator(".popular-list li")).toHaveCount(5);
});

test("article detail keeps the weekend sponsor CTA visible", async ({ page }) => {
  await page.goto("/posts/newsletter-launch-window");
  await expect(page.getByRole("link", { name: "이 페이지 스폰서 하기" }).first()).toBeVisible();
});
