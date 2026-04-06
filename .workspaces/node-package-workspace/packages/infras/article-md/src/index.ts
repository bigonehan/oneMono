import type { Article } from "@domain/article";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export type ArticleFileSchema = {
  article: Article;
  authorLoginId: string;
  authorName: string;
};

type ArticleFrontmatter = Omit<Article, "body"> & {
  authorLoginId: string;
  authorName: string;
};

export type ArticleMarkdownStore = {
  get(articleId: string): Promise<ArticleFileSchema | null>;
  list(): Promise<ArticleFileSchema[]>;
  save(schema: ArticleFileSchema): Promise<void>;
  delete(articleId: string): Promise<boolean>;
};

type ArticleMarkdownStoreOptions = {
  rootDir?: string;
};

const DEFAULT_ROOT_DIR = path.resolve(process.cwd(), ".data/posts");
const FRONTMATTER_START = "---\n";
const FRONTMATTER_END = "\n---\n";
const isArticleRule = (value: string): value is Article["rule"] =>
  value === "public" || value === "private" || value === "protected";

const ensureSafeId = (articleId: string): string => {
  if (!/^[a-zA-Z0-9_-]+$/.test(articleId)) {
    throw new Error("invalid article id");
  }
  return articleId;
};

const toMarkdown = (schema: ArticleFileSchema): string => {
  const meta: ArticleFrontmatter = {
    id: schema.article.id,
    title: schema.article.title,
    rule: schema.article.rule,
    created_at: schema.article.created_at,
    modified_at: schema.article.modified_at,
    authorLoginId: schema.authorLoginId,
    authorName: schema.authorName,
  };

  return `${FRONTMATTER_START}${JSON.stringify(meta)}${FRONTMATTER_END}${schema.article.body}\n`;
};

const fromMarkdown = (content: string): ArticleFileSchema | null => {
  if (!content.startsWith(FRONTMATTER_START)) {
    return null;
  }

  const endIndex = content.indexOf(FRONTMATTER_END, FRONTMATTER_START.length);
  if (endIndex < 0) {
    return null;
  }

  const rawMeta = content.slice(FRONTMATTER_START.length, endIndex).trim();
  const body = content.slice(endIndex + FRONTMATTER_END.length).trimEnd();

  let parsedMeta: ArticleFrontmatter;
  try {
    parsedMeta = JSON.parse(rawMeta) as ArticleFrontmatter;
  } catch {
    return null;
  }

  if (
    typeof parsedMeta.id !== "string" ||
    typeof parsedMeta.title !== "string" ||
    typeof parsedMeta.rule !== "string" ||
    typeof parsedMeta.created_at !== "string" ||
    typeof parsedMeta.modified_at !== "string" ||
    typeof parsedMeta.authorLoginId !== "string" ||
    typeof parsedMeta.authorName !== "string"
  ) {
    return null;
  }

  if (!isArticleRule(parsedMeta.rule)) {
    return null;
  }

  return {
    article: {
      id: parsedMeta.id,
      title: parsedMeta.title,
      body,
      rule: parsedMeta.rule,
      created_at: parsedMeta.created_at,
      modified_at: parsedMeta.modified_at,
    },
    authorLoginId: parsedMeta.authorLoginId,
    authorName: parsedMeta.authorName,
  };
};

export const createArticleMarkdownStore = (
  options: ArticleMarkdownStoreOptions = {},
): ArticleMarkdownStore => {
  const rootDir = options.rootDir ?? DEFAULT_ROOT_DIR;

  const filePathOf = (articleId: string): string => {
    const safeId = ensureSafeId(articleId);
    return path.join(rootDir, `${safeId}.md`);
  };

  const ensureRootDir = async (): Promise<void> => {
    await mkdir(rootDir, { recursive: true });
  };

  return {
    async get(articleId) {
      const filePath = filePathOf(articleId);
      try {
        const content = await readFile(filePath, "utf8");
        return fromMarkdown(content);
      } catch {
        return null;
      }
    },

    async list() {
      await ensureRootDir();
      const entries = await readdir(rootDir, { withFileTypes: true });

      const rows = await Promise.all(
        entries
          .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
          .map(async (entry) => {
            const fullPath = path.join(rootDir, entry.name);
            const [content, stats] = await Promise.all([
              readFile(fullPath, "utf8"),
              stat(fullPath),
            ]);
            const parsed = fromMarkdown(content);
            if (!parsed) {
              return null;
            }
            return { schema: parsed, modifiedAtMs: stats.mtimeMs };
          }),
      );

      return rows
        .filter((row): row is { schema: ArticleFileSchema; modifiedAtMs: number } => row !== null)
        .sort((a, b) => b.modifiedAtMs - a.modifiedAtMs)
        .map((row) => row.schema);
    },

    async save(schema) {
      await ensureRootDir();
      const filePath = filePathOf(schema.article.id);
      await writeFile(filePath, toMarkdown(schema), "utf8");
    },

    async delete(articleId) {
      const filePath = filePathOf(articleId);
      try {
        await rm(filePath);
        return true;
      } catch {
        return false;
      }
    },
  };
};
