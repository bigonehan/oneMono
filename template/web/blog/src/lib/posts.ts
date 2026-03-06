import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ArticleDocument } from "@features/article";
import { normalizeCategory } from "./category";

const POSTS_DIR = path.join(process.cwd(), "posts");

type PostMeta = {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[] | string;
  category?: string;
  draft?: boolean;
  series?: string;
  seriesOrder?: number;
};

export type BlogPost = ArticleDocument;

export const normalizeTag = (tag: string): string => tag.trim().toLowerCase();

const parseTags = (raw: string[] | string | undefined): string[] => {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : raw.split(",");
  return Array.from(new Set(list.map((item) => normalizeTag(String(item))).filter(Boolean))).slice(0, 5);
};

const ensurePostsDir = (): void => {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
};

const readPostFile = (filename: string): BlogPost | null => {
  const fullPath = path.join(POSTS_DIR, filename);
  const content = fs.readFileSync(fullPath, "utf8");
  const { data, content: body } = matter(content);
  const meta = data as PostMeta;

  if (!meta.title || !meta.date) {
    return null;
  }

  const slug = filename.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
  return {
    slug,
    title: String(meta.title),
    description: meta.description ? String(meta.description) : "",
    date: String(meta.date),
    tags: parseTags(meta.tags),
    category: normalizeCategory(meta.category),
    draft: Boolean(meta.draft),
    series: meta.series ? String(meta.series) : undefined,
    seriesOrder: typeof meta.seriesOrder === "number" ? meta.seriesOrder : undefined,
    content: body,
    path: fullPath,
  };
};

const assertSeriesOrder = (posts: BlogPost[]): void => {
  const map = new Map<string, Set<number>>();
  for (const post of posts) {
    if (!post.series || post.seriesOrder === undefined) continue;
    const key = post.series.toLowerCase();
    const set = map.get(key) ?? new Set<number>();
    if (set.has(post.seriesOrder)) {
      throw new Error(`Duplicate seriesOrder '${post.seriesOrder}' in series '${post.series}'.`);
    }
    set.add(post.seriesOrder);
    map.set(key, set);
  }
};

export const getAllPosts = (): BlogPost[] => {
  ensurePostsDir();
  const files = fs.readdirSync(POSTS_DIR).filter((name) => name.endsWith(".md"));
  const posts = files
    .map((name) => readPostFile(name))
    .filter((item): item is BlogPost => item !== null)
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  assertSeriesOrder(posts);
  return posts;
};

export const getPostBySlug = (slug: string): { post: BlogPost; prev?: BlogPost; next?: BlogPost } | null => {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index < 0) return null;
  return {
    post: posts[index],
    prev: posts[index + 1],
    next: posts[index - 1],
  };
};

export const getTagCounts = (): Array<{ tag: string; count: number }> => {
  const map = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  const normalized = normalizeTag(tag);
  return getAllPosts().filter((post) => post.tags.includes(normalized));
};

export const getCategoryCounts = (): Array<{ category: string; count: number }> => {
  const map = new Map<string, number>();
  for (const post of getAllPosts()) {
    map.set(post.category, (map.get(post.category) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  const normalized = normalizeCategory(category);
  return getAllPosts().filter((post) => post.category === normalized);
};

export const getSeriesPosts = (series: string): BlogPost[] => {
  const normalized = series.toLowerCase();
  return getAllPosts()
    .filter((post) => post.series?.toLowerCase() === normalized)
    .sort((a, b) => (a.seriesOrder ?? Number.MAX_SAFE_INTEGER) - (b.seriesOrder ?? Number.MAX_SAFE_INTEGER));
};

export const getSearchIndex = (): Array<{
  slug: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
}> =>
  getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags,
    content: post.content,
  }));
