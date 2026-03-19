import type { IArticleBookmarkUseCase } from "./article-usecase";

type Bookmark = { articleSlug: string; savedAt: string };
const bookmarkStore = new Map<string, Map<string, Bookmark>>();

export class ArticleBookmarkMemoryRepo implements IArticleBookmarkUseCase {
  async toggle(articleSlug: string, userEmail: string): Promise<{ bookmarked: boolean }> {
    const byUser = bookmarkStore.get(userEmail) ?? new Map<string, Bookmark>();
    const current = byUser.get(articleSlug);
    if (current) {
      byUser.delete(articleSlug);
      bookmarkStore.set(userEmail, byUser);
      return { bookmarked: false };
    }

    byUser.set(articleSlug, { articleSlug, savedAt: new Date().toISOString() });
    bookmarkStore.set(userEmail, byUser);
    return { bookmarked: true };
  }

  async listByUser(userEmail: string): Promise<Array<{ articleSlug: string; savedAt: string }>> {
    const byUser = bookmarkStore.get(userEmail) ?? new Map<string, Bookmark>();
    return Array.from(byUser.values()).sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
  }
}
