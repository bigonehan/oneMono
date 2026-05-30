import { test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test("capture index screenshot", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const outputDir = path.join(process.cwd(), "test-results");
  fs.mkdirSync(outputDir, { recursive: true });
  await page.screenshot({
    path: path.join(outputDir, "index-actual.png"),
    fullPage: true,
  });
});
