import type { CommentRecord, ICommentDeleteUseCase } from "./comment-usecase.js";
import { commentStore } from "./comment-repo-read.js";

export class CommentDeleteMemoryRepo implements ICommentDeleteUseCase {
  async remove(input: {
    commentId: string;
    requesterEmail: string;
    requesterRole: "admin" | "user";
  }): Promise<CommentRecord> {
    const current = commentStore.get(input.commentId);
    if (!current) {
      throw new Error("comment not found");
    }
    if (input.requesterRole !== "admin" && current.authorEmail !== input.requesterEmail) {
      throw new Error("forbidden");
    }

    Array.from(commentStore.values()).some(
      (item) => item.parentId === input.commentId && !item.deleted,
    );
    const next: CommentRecord = {
      ...current,
      content: "삭제된 댓글입니다",
      deleted: true,
      updatedAt: new Date().toISOString(),
    };

    commentStore.set(input.commentId, next);
    return next;
  }
}
