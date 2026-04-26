export type CommentCreateInput = {
  postId: string;
  content: string;
};

export type CommentCreateSchemaErrorCode = "invalid_input";

export type CommentCreateSchemaResult =
  | { ok: true; value: CommentCreateInput }
  | { ok: false; code: CommentCreateSchemaErrorCode; message: string };

const MAX_CONTENT_LENGTH = 500;

export const parseCommentCreateInput = (raw: unknown): CommentCreateSchemaResult => {
  if (!raw || typeof raw !== "object") {
    return { ok: false, code: "invalid_input", message: "input must be object" };
  }

  const input = raw as { postId?: unknown; content?: unknown };
  const postId = typeof input.postId === "string" ? input.postId.trim() : "";
  const content = typeof input.content === "string" ? input.content : "";

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
      postId,
      content,
    },
  };
};
