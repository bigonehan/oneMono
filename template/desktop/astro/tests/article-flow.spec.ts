import { expect, test } from "@playwright/test";

test("add button opens editor and saving adds article", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("app-ready")).toHaveText("ready");

  await expect(page.getByTestId("article-count")).toHaveText("count: 0");

  await page.getByTestId("open-editor").click({ force: true });
  await expect(page.getByTestId("editor-modal")).toBeVisible();

  await page.getByTestId("editor-title").fill("첫 번째 글");
  await page.getByTestId("editor-rule").selectOption("public");
  await page.getByTestId("save-article").click({ force: true });

  await expect(page.getByTestId("editor-modal")).toHaveCount(0);
  await expect(page.getByTestId("article-count")).toHaveText("count: 1");
  await expect(page.getByText("첫 번째 글")).toBeVisible();
});
