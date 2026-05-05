export type CommentReplyInput = {
  parentId: string;
  postId: string;
  content: string;
};

export type CommentReplySchemaErrorCode = "invalid_input";

export type CommentReplySchemaResult =
  | { ok: true; value: CommentReplyInput }
  | { ok: false; code: CommentReplySchemaErrorCode; message: string };

const MAX_CONTENT_LENGTH = 500;

export const parseCommentReplyInput = (raw: unknown): CommentReplySchemaResult => {
  if (!raw || typeof raw !== "object") {
    return { ok: false, code: "invalid_input", message: "input must be object" };
  }

  const input = raw as { parentId?: unknown; postId?: unknown; content?: unknown };
  const parentId = typeof input.parentId === "string" ? input.parentId.trim() : "";
  const postId = typeof input.postId === "string" ? input.postId.trim() : "";
  const content = typeof input.content === "string" ? input.content : "";

  if (!parentId) {
    return { ok: false, code: "invalid_input", message: "parentId is required" };
  }

  if (!postId) {
    return { ok: false, code: "invalid_input", message: "postId is required" };
  }

  if (content.length < 1 || content.length > MAX_CONTENT_LENGTH) {
    return { ok: false, code: "invalid_input", message: "content length must be 1..500" };
  }

  if (!content.trim()) {
    return { ok: false, code: "invalid_input", message: "content is required" };
  }

  return {
    ok: true,
    value: {
      parentId,
      postId,
      content,
    },
  };
};
