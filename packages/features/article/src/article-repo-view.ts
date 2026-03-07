import type { IArticleViewUseCase } from "./article-usecase";

const HOUR_MS = 60 * 60 * 1000;
const viewCountStore = new Map<string, number>();
const visitStore = new Map<string, number>();

const isBot = (userAgent: string): boolean => /bot|crawler|spider|slurp|facebookexternalhit/i.test(userAgent);

export class ArticleViewMemoryRepo implements IArticleViewUseCase {
  async record(input: { articleSlug: string; ip: string; userAgent: string; now?: Date }): Promise<{ count: number; counted: boolean }> {
    const { articleSlug, ip, userAgent } = input;
    const nowMs = (input.now ?? new Date()).getTime();
    const key = `${articleSlug}:${ip}`;
    if (isBot(userAgent)) {
      return {
        count: viewCountStore.get(articleSlug) ?? 0,
        counted: false,
      };
    }

    const lastVisitedAt = visitStore.get(key);
    if (lastVisitedAt && nowMs - lastVisitedAt < HOUR_MS) {
      return {
        count: viewCountStore.get(articleSlug) ?? 0,
        counted: false,
      };
    }

    const nextCount = (viewCountStore.get(articleSlug) ?? 0) + 1;
    viewCountStore.set(articleSlug, nextCount);
    visitStore.set(key, nowMs);
    return { count: nextCount, counted: true };
  }
}
