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
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: "새 글 작성" })).toBeVisible();
  await page.locator('input[name="title"]').fill(title);
  await page.locator('input[name="tags"]').fill("playwright,write");
  await page.locator('input[name="category"]').fill("tech");
  await page.locator('input[name="description"]').fill("playwright write flow");
  await page.locator('input[name="date"]').fill(date);
  await page.locator(".ProseMirror").click({ force: true });
  await page.keyboard.type("hellowolrd");

  await page.getByRole("button", { name: "등록" }).click({ force: true });
  const result = page.locator("form.write-form > p");
  await expect(result).not.toHaveText("");
  await expect(result).toContainText(`저장 완료: ${slug}`);
  await expect(page.getByRole("link", { name: "방금 저장한 글 보기" })).toHaveAttribute("href", `/posts/${slug}`);
  await expect(page.getByRole("link", { name: "메인에서 확인" })).toHaveAttribute("href", "/");
  await expect.poll(() => fs.existsSync(filePath)).toBeTruthy();

  const created = fs.readFileSync(filePath, "utf8");
  expect(created).toContain("hellowolrd");

  await page.getByRole("link", { name: "방금 저장한 글 보기" }).click();
  await page.waitForURL(`**/posts/${slug}`);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText("hellowolrd")).toBeVisible();

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("link", { name: title }).first()).toBeVisible();

  fs.unlinkSync(filePath);
});
