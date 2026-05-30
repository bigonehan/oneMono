export type StoredComment = {
  commentId: string;
  postId: string;
  authorLoginId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type UpdateCommentInput = {
  content: string;
};

export type CommentRepository = {
  getById(commentId: string): StoredComment | null;
  create(input: Omit<StoredComment, "updatedAt"> & { updatedAt?: string }): StoredComment;
  updateById(commentId: string, input: UpdateCommentInput): StoredComment | null;
};

const cloneComment = (comment: StoredComment): StoredComment => ({ ...comment });

export const createInMemoryCommentRepository = (
  initial: StoredComment[] = [],
): CommentRepository => {
  const commentsById = new Map<string, StoredComment>(
    initial.map((row) => [row.commentId, cloneComment(row)]),
  );

  return {
    getById(commentId: string) {
      const found = commentsById.get(commentId);
      return found ? cloneComment(found) : null;
    },
    create(input) {
      const next: StoredComment = {
        ...input,
        updatedAt: input.updatedAt ?? input.createdAt,
      };
      commentsById.set(next.commentId, next);
      return cloneComment(next);
    },
    updateById(commentId: string, input: UpdateCommentInput) {
      const found = commentsById.get(commentId);
      if (!found) {
        return null;
      }

      const updated: StoredComment = {
        ...found,
        content: input.content,
        updatedAt: new Date().toISOString(),
      };
      commentsById.set(commentId, updated);
      return cloneComment(updated);
    },
  };
};

export const commentRepository = createInMemoryCommentRepository();
