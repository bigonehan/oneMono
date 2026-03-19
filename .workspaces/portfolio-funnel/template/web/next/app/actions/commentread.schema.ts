export type CommentReadInput = {
  postId: string;
  page: number;
};

export type CommentReadMode = "initial" | "append";

export type CommentReadSchemaErrorCode =
  | "invalid_input"
  | "invalid_post_id"
  | "invalid_page"
  | "invalid_append_page";

export type CommentReadSchemaResult =
  | { ok: true; value: CommentReadInput }
  | { ok: false; code: CommentReadSchemaErrorCode; message: string };

const normalizePage = (value: unknown): number | null => {
  if (value === undefined || value === null || value === "") {
    return 1;
  }

  if (typeof value === "number") {
    if (!Number.isInteger(value) || value < 1) {
      return null;
    }

    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
      return null;
    }

    return parsed;
  }

  return null;
};

export const parseCommentReadInput = (
  raw: unknown,
  mode: CommentReadMode = "initial",
): CommentReadSchemaResult => {
  if (!raw || typeof raw !== "object") {
    return { ok: false, code: "invalid_input", message: "input must be object" };
  }

  const input = raw as { postId?: unknown; page?: unknown };
  const postId = typeof input.postId === "string" ? input.postId.trim() : "";
  const page = normalizePage(input.page);

  if (!postId) {
    return { ok: false, code: "invalid_post_id", message: "postId is required" };
  }

  if (page === null) {
    return { ok: false, code: "invalid_page", message: "page must be >= 1" };
  }

  if (mode === "append" && page < 2) {
    return { ok: false, code: "invalid_append_page", message: "append page must be >= 2" };
  }

  return {
    ok: true,
    value: {
      postId,
      page,
    },
  };
};
