export type CommentDeleteResult =
  | {
      ok: true;
      code: "deleted";
      message: string;
      commentId: string;
    }
  | {
      ok: false;
      code:
        | "invalid_id"
        | "unauthorized"
        | "forbidden"
        | "not_found"
        | "delete_failed"
        | "request_failed";
      message: string;
      commentId?: string;
    };

export type CommentDeleteInput = {
  commentId: string;
  requesterLoginId: string;
  requesterIsAdmin: boolean;
};

export type CommentDeleteEntity = {
  id: string;
  authorLoginId: string;
  isDeleted: boolean;
};

type DeleteDeps = {
  findCommentById: (commentId: string) => Promise<CommentDeleteEntity | null> | CommentDeleteEntity | null;
  softDeleteCommentById: (commentId: string) => Promise<boolean> | boolean;
};

const isValidCommentId = (value: string): boolean => /^[a-zA-Z0-9_-]{3,128}$/.test(value);

export const executeCommentDelete = (
  input: CommentDeleteInput,
  deps: DeleteDeps,
): Promise<CommentDeleteResult> => {
  return executeCommentDeleteInternal(input, deps);
};

const executeCommentDeleteInternal = async (
  input: CommentDeleteInput,
  deps: DeleteDeps,
): Promise<CommentDeleteResult> => {
  const commentId = input.commentId.trim();
  if (!isValidCommentId(commentId)) {
    return { ok: false, code: "invalid_id", message: "invalid comment id" };
  }

  const requesterLoginId = input.requesterLoginId.trim();
  if (!requesterLoginId) {
    return { ok: false, code: "unauthorized", message: "unauthorized", commentId };
  }

  const found = await deps.findCommentById(commentId);
  if (!found || found.isDeleted) {
    return { ok: false, code: "not_found", message: "comment not found", commentId };
  }

  const allowed = input.requesterIsAdmin || found.authorLoginId === requesterLoginId;
  if (!allowed) {
    return { ok: false, code: "forbidden", message: "forbidden", commentId };
  }

  const deleted = await deps.softDeleteCommentById(commentId);
  if (!deleted) {
    return { ok: false, code: "delete_failed", message: "delete failed", commentId };
  }

  return { ok: true, code: "deleted", message: "deleted", commentId };
};

export const requestCommentDelete = async (commentId: string): Promise<CommentDeleteResult> => {
  const normalized = commentId.trim();
  if (!isValidCommentId(normalized)) {
    return { ok: false, code: "invalid_id", message: "invalid comment id" };
  }

  try {
    const response = await fetch(`/api/comments/${normalized}`, {
      method: "DELETE",
      credentials: "include",
    });

    const payload = (await response.json()) as CommentDeleteResult;
    if (!payload || typeof payload.ok !== "boolean" || typeof payload.code !== "string") {
      return { ok: false, code: "request_failed", message: "invalid response" };
    }

    return payload;
  } catch {
    return { ok: false, code: "request_failed", message: "request failed" };
  }
};
