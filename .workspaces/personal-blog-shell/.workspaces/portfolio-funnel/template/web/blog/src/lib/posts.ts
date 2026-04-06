import { ArticleReadFileRepo, type ArticleDocument } from "@features/article";
import { normalizeCategory } from "./category";

export type BlogPost = ArticleDocument;
const articleReadRepo = new ArticleReadFileRepo(process.cwd());

export const normalizeTag = (tag: string): string => tag.trim().toLowerCase();

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

const normalizePost = (post: BlogPost): BlogPost => ({
  ...post,
  tags: Array.from(new Set(post.tags.map((item) => normalizeTag(String(item))).filter(Boolean))).slice(0, 5),
  category: normalizeCategory(post.category),
});

export const getAllPosts = async (): Promise<BlogPost[]> => {
  const posts = (await articleReadRepo.list()).map(normalizePost);

  assertSeriesOrder(posts);
  return posts;
};

export const getPostBySlug = (
  slug: string,
): Promise<{ post: BlogPost; prev?: BlogPost; next?: BlogPost } | null> => articleReadRepo.getDetail(slug);

export const getTagCounts = async (): Promise<Array<{ tag: string; count: number }>> => {
  const map = new Map<string, number>();
  for (const post of await getAllPosts()) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
};

export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  const normalized = normalizeTag(tag);
  return (await getAllPosts()).filter((post) => post.tags.includes(normalized));
};

export const getCategoryCounts = async (): Promise<Array<{ category: string; count: number }>> => {
  const map = new Map<string, number>();
  for (const post of await getAllPosts()) {
    map.set(post.category, (map.get(post.category) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
};

export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const normalized = normalizeCategory(category);
  return (await getAllPosts()).filter((post) => post.category === normalized);
};

export const getSeriesPosts = async (series: string): Promise<BlogPost[]> => {
  const normalized = series.toLowerCase();
  return (await getAllPosts())
    .filter((post) => post.series?.toLowerCase() === normalized)
    .sort((a, b) => (a.seriesOrder ?? Number.MAX_SAFE_INTEGER) - (b.seriesOrder ?? Number.MAX_SAFE_INTEGER));
};

export const getSearchIndex = (): Promise<
  Array<{
    slug: string;
    title: string;
    description: string;
    tags: string[];
    content: string;
  }>
> => articleReadRepo.getSearchIndex();

export const searchPosts = (query: string): ReturnType<ArticleReadFileRepo["search"]> => articleReadRepo.search(query);
