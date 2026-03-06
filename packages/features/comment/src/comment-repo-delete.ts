import type { CommentRecord, ICommentDeleteUseCase } from "./comment-usecase";
import { commentStore } from "./comment-repo-read";

export class CommentDeleteMemoryRepo implements ICommentDeleteUseCase {
  async remove(commentId: string): Promise<CommentRecord> {
    const current = commentStore.get(commentId);
    if (!current) {
      throw new Error("comment not found");
    }

    const hasReply = Array.from(commentStore.values()).some((item) => item.parentId === commentId && !item.deleted);
    const next: CommentRecord = {
      ...current,
      content: "삭제된 댓글입니다",
      deleted: !hasReply,
      updatedAt: new Date().toISOString(),
    };

    commentStore.set(commentId, next);
    return next;
  }
}
