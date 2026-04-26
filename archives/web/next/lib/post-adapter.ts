import { MarkdownArticleAdapter } from "@adapters/article-md";
import { createArticleMarkdownStore } from "@infras/article-md";
import path from "node:path";

const storageRootDir = process.env.POST_STORAGE_DIR ?? path.resolve(process.cwd(), ".data", "posts");

const markdownStore = createArticleMarkdownStore({ rootDir: storageRootDir });

export const postAdapter = new MarkdownArticleAdapter(markdownStore);
