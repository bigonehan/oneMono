import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test("capture index screenshot", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: "개인이 글을 쓰고 쌓아 두는 기본형 블로그" })).toBeVisible();
  await expect(page.getByRole("link", { name: "새 글 작성" })).toBeVisible();

  const outputDir = path.join(process.cwd(), "test-results");
  fs.mkdirSync(outputDir, { recursive: true });
  await page.screenshot({
    path: path.join(outputDir, "index-actual.png"),
    fullPage: true,
  });
});
