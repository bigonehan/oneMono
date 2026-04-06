import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test("write form creates a blog article that includes hellowolrd", async ({ page }) => {
  const title = "Personal blog draft";
  const date = "2026-03-07";
  const slug = "personal-blog-draft";
  const filename = `${date}-${slug}.md`;
  const filePath = path.join(process.cwd(), "posts", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await page.goto("/write");
  await expect(page.getByRole("heading", { name: "새 글 작성" })).toBeVisible();
  await expect(page.locator("form.write-form")).toBeVisible();
  await expect(page.locator('input[name="title"]')).toBeVisible();
  await page.locator('input[name="title"]').fill(title);
  await page.locator('input[name="tags"]').fill("playwright,write");
  await page.locator('input[name="category"]').fill("tech");
  await page.locator('input[name="description"]').fill("playwright write flow");
  await page.locator('input[name="date"]').fill(date);
  await page.locator('textarea[name="content"]').fill("hellowolrd");

  await page.locator("form.write-form").evaluate((form) => {
    (form as HTMLFormElement).requestSubmit();
  });
  const result = page.locator("form.write-form > p");
  await expect(result).not.toHaveText("");
  await expect(result).toContainText(`저장 완료: ${slug}`);
  await expect.poll(() => fs.existsSync(filePath)).toBeTruthy();

  const created = fs.readFileSync(filePath, "utf8");
  expect(created).toContain("hellowolrd");

  fs.unlinkSync(filePath);
});
