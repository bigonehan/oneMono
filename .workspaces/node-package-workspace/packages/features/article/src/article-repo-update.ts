import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ArticleCreateInput, ArticleDocument, IArticleUpdateUseCase } from "./article-usecase";

export class ArticleUpdateFileRepo implements IArticleUpdateUseCase {
  constructor(private readonly rootDir: string) {}

  async update(slug: string, input: Partial<ArticleCreateInput>): Promise<ArticleDocument> {
    const postsDir = path.join(this.rootDir, "posts");
    const target = fs
      .readdirSync(postsDir)
      .find((file) => file.endsWith(`-${slug}.md`) || file.replace(/\.md$/, "") === slug);

    if (!target) {
      throw new Error(`article not found: ${slug}`);
    }

    const fullPath = path.join(postsDir, target);
    const raw = fs.readFileSync(fullPath, "utf8");
    const parsed = matter(raw);
    const nextData = { ...parsed.data, ...input };
    const nextContent = input.content ?? parsed.content;
    fs.writeFileSync(fullPath, matter.stringify(nextContent, nextData), "utf8");

    return {
      slug,
      title: String(nextData.title ?? ""),
      date: String(nextData.date ?? ""),
      tags: Array.isArray(nextData.tags) ? nextData.tags.map(String) : [],
      category: String(nextData.category ?? "uncategorized"),
      description: String(nextData.description ?? ""),
      content: nextContent,
      draft: Boolean(nextData.draft),
      series: nextData.series ? String(nextData.series) : undefined,
      seriesOrder: typeof nextData.seriesOrder === "number" ? nextData.seriesOrder : undefined,
      path: fullPath,
    };
  }
}
