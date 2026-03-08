export type CommentUpdateInput = {
  commentId: string;
  content: string;
};

export type CommentUpdateSchemaErrorCode = "invalid_input";

export type CommentUpdateSchemaResult =
  | { ok: true; value: CommentUpdateInput }
  | { ok: false; code: CommentUpdateSchemaErrorCode; message: string };

const MAX_CONTENT_LENGTH = 500;
const COMMENT_ID_PATTERN = /^[a-zA-Z0-9_-]{3,128}$/;

export const parseCommentUpdateInput = (raw: unknown): CommentUpdateSchemaResult => {
  if (!raw || typeof raw !== "object") {
    return { ok: false, code: "invalid_input", message: "input must be object" };
  }

  const input = raw as { commentId?: unknown; content?: unknown };
  const commentId = typeof input.commentId === "string" ? input.commentId.trim() : "";
  const content = typeof input.content === "string" ? input.content.trim() : "";

  if (!commentId) {
    return { ok: false, code: "invalid_input", message: "commentId is required" };
  }

  if (!COMMENT_ID_PATTERN.test(commentId)) {
    return { ok: false, code: "invalid_input", message: "commentId is invalid" };
  }

  if (!content) {
    return { ok: false, code: "invalid_input", message: "content is required" };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return { ok: false, code: "invalid_input", message: "content is too long" };
  }

  return {
    ok: true,
    value: {
      commentId,
      content,
    },
  };
};
