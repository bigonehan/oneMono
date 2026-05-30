import { randomUUID } from "node:crypto";
import type { CommentRecord, ICommentCreateUseCase } from "./comment-usecase.js";
import { commentStore } from "./comment-repo-read.js";

const bannedWords = ["badword"];

export class CommentCreateMemoryRepo implements ICommentCreateUseCase {
  async create(
    input: Omit<CommentRecord, "id" | "deleted" | "createdAt" | "updatedAt">,
  ): Promise<CommentRecord> {
    const normalized = input.content.trim();
    if (normalized.length < 1 || normalized.length > 500) {
      throw new Error("comment must be 1..500 characters");
    }
    if (bannedWords.some((word) => normalized.toLowerCase().includes(word))) {
      throw new Error("comment blocked by profanity filter");
    }

    if (input.parentId) {
      const parent = commentStore.get(input.parentId);
      if (!parent || parent.parentId) {
        throw new Error("only 1 depth replies are allowed");
      }
    }

    const now = new Date().toISOString();
    const comment: CommentRecord = {
      id: randomUUID(),
      articleSlug: input.articleSlug,
      authorEmail: input.authorEmail,
      content: normalized,
      parentId: input.parentId,
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };

    commentStore.set(comment.id, comment);
    return comment;
  }
}
