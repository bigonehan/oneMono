import fs from "node:fs";
import path from "node:path";
import type { ArticleCreateInput, ArticleDocument, IArticleCreateUseCase } from "./article-usecase";

const normalizeSlug = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const buildFrontmatter = (input: ArticleCreateInput): string => {
  const tags = input.tags.map((tag) => `'${tag.toLowerCase()}'`).join(", ");
  return `---\ntitle: "${input.title}"\ndate: "${input.date}"\ntags: [${tags}]\ncategory: "${input.category.toLowerCase()}"\ndescription: "${input.description ?? ""}"${input.series ? `\nseries: "${input.series}"` : ""}${typeof input.seriesOrder === "number" ? `\nseriesOrder: ${input.seriesOrder}` : ""}\n---\n\n${input.content}\n`;
};

export class ArticleCreateFileRepo implements IArticleCreateUseCase {
  constructor(private readonly rootDir: string) {}

  async create(input: ArticleCreateInput): Promise<ArticleDocument> {
    if (!input.title || !input.date || !input.tags?.length || !input.category) {
      throw new Error("title/date/tags/category are required");
    }
    if (input.tags.length > 5) {
      throw new Error("tags can not exceed 5");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      throw new Error("date must follow YYYY-MM-DD format");
    }

    const postsDir = path.join(this.rootDir, "posts");
    fs.mkdirSync(postsDir, { recursive: true });

    const slug = normalizeSlug(input.title);
    if (!slug) {
      throw new Error("slug can not be empty");
    }
    const exists = fs
      .readdirSync(postsDir)
      .filter((file) => file.endsWith(".md"))
      .some((file) => file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "") === slug);
    if (exists) {
      throw new Error(`slug already exists: ${slug}`);
    }
    const filename = `${input.date}-${slug}.md`;
    const fullPath = path.join(postsDir, filename);

    fs.writeFileSync(fullPath, buildFrontmatter(input), "utf8");
    return {
      slug,
      title: input.title,
      date: input.date,
      tags: input.tags.map((tag) => tag.toLowerCase()),
      category: input.category.toLowerCase(),
      description: input.description ?? "",
      content: input.content,
      draft: false,
      series: input.series,
      seriesOrder: input.seriesOrder,
      path: fullPath,
    };
  }
}

export const createArticle = async (
  rootDir: string,
  input: ArticleCreateInput,
): Promise<ArticleDocument> => {
  const repo = new ArticleCreateFileRepo(rootDir);
  return repo.create(input);
};
