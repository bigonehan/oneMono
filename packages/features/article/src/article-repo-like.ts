import type { IArticleLikeUseCase } from "./article-usecase";

const likeStore = new Map<string, Set<string>>();

export class ArticleLikeMemoryRepo implements IArticleLikeUseCase {
  async toggle(articleSlug: string, userEmail: string): Promise<{ liked: boolean; count: number }> {
    const set = likeStore.get(articleSlug) ?? new Set<string>();
    const liked = !set.has(userEmail);
    if (liked) {
      set.add(userEmail);
    } else {
      set.delete(userEmail);
    }
    likeStore.set(articleSlug, set);
    return { liked, count: set.size };
  }

  async count(articleSlug: string): Promise<number> {
    return (likeStore.get(articleSlug) ?? new Set<string>()).size;
  }
}
