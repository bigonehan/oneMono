import type { CommentRecord, ICommentUpdateUseCase } from "./comment-usecase";
import { commentStore } from "./comment-repo-read";

export class CommentUpdateMemoryRepo implements ICommentUpdateUseCase {
  async update(input: {
    commentId: string;
    content: string;
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
    const normalized = input.content.trim();
    if (normalized.length < 1 || normalized.length > 500) {
      throw new Error("comment must be 1..500 characters");
    }

    const next: CommentRecord = {
      ...current,
      content: normalized,
      updatedAt: new Date().toISOString(),
    };

    commentStore.set(input.commentId, next);
    return next;
  }
}
