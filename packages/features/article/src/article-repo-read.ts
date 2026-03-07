import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Fuse from "fuse.js";
import type { ArticleDocument, IArticleReadUseCase } from "./article-usecase";

export class ArticleReadFileRepo implements IArticleReadUseCase {
  constructor(private readonly rootDir: string) {}

  async list(): Promise<ArticleDocument[]> {
    const postsDir = path.join(this.rootDir, "posts");
    if (!fs.existsSync(postsDir)) return [];

    const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
    return files
      .map((file) => {
        const fullPath = path.join(postsDir, file);
        const raw = fs.readFileSync(fullPath, "utf8");
        const parsed = matter(raw);
        const slug = file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
        return {
          slug,
          title: String(parsed.data.title ?? ""),
          date: String(parsed.data.date ?? ""),
          tags: Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : [],
          category: String(parsed.data.category ?? "uncategorized"),
          description: String(parsed.data.description ?? ""),
          content: parsed.content,
          draft: Boolean(parsed.data.draft),
          series: parsed.data.series ? String(parsed.data.series) : undefined,
          seriesOrder: typeof parsed.data.seriesOrder === "number" ? parsed.data.seriesOrder : undefined,
          path: fullPath,
        } satisfies ArticleDocument;
      })
      .filter((item) => !item.draft)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  async get(slug: string): Promise<ArticleDocument | null> {
    const rows = await this.list();
    return rows.find((item) => item.slug === slug) ?? null;
  }

  async getDetail(
    slug: string,
  ): Promise<{
    post: ArticleDocument;
    prev?: ArticleDocument;
    next?: ArticleDocument;
  } | null> {
    const rows = await this.list();
    const index = rows.findIndex((item) => item.slug === slug);
    if (index < 0) {
      return null;
    }

    return {
      post: rows[index],
      prev: rows[index + 1],
      next: rows[index - 1],
    };
  }

  async getSearchIndex(): Promise<
    Array<{
      slug: string;
      title: string;
      description: string;
      tags: string[];
      content: string;
    }>
  > {
    const rows = await this.list();
    return rows.map((item) => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
      tags: item.tags,
      content: item.content,
    }));
  }

  async search(
    query: string,
  ): Promise<
    Array<{
      slug: string;
      title: string;
      description: string;
      tags: string[];
      content: string;
      score: number;
    }>
  > {
    const normalized = query.trim();
    if (normalized.length < 2) {
      return [];
    }

    const index = await this.getSearchIndex();
    const fuse = new Fuse(index, {
      includeScore: true,
      threshold: 0.35,
      keys: [
        { name: "title", weight: 0.4 },
        { name: "description", weight: 0.2 },
        { name: "tags", weight: 0.25 },
        { name: "content", weight: 0.15 },
      ],
    });

    return fuse.search(normalized).map((row) => ({
      ...row.item,
      score: row.score ?? 0,
    }));
  }
}
