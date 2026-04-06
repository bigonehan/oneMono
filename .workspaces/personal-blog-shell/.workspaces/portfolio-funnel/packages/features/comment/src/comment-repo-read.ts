import type { CommentRecord, ICommentReadUseCase } from "./comment-usecase";

export const commentStore = new Map<string, CommentRecord>();

export class CommentReadMemoryRepo implements ICommentReadUseCase {
  async listByArticle(articleSlug: string): Promise<CommentRecord[]> {
    return Array.from(commentStore.values()).filter((item) => item.articleSlug === articleSlug);
  }
}
