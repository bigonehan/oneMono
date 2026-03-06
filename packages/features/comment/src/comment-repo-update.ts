import type { CommentRecord, ICommentUpdateUseCase } from "./comment-usecase";
import { commentStore } from "./comment-repo-read";

export class CommentUpdateMemoryRepo implements ICommentUpdateUseCase {
  async update(commentId: string, content: string): Promise<CommentRecord> {
    const current = commentStore.get(commentId);
    if (!current) {
      throw new Error("comment not found");
    }

    const next: CommentRecord = {
      ...current,
      content,
      updatedAt: new Date().toISOString(),
    };

    commentStore.set(commentId, next);
    return next;
  }
}
