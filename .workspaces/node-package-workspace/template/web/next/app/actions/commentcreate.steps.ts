import { parseCommentCreateInput } from "./commentcreate.schema";

type CommentCreateStepsContext = {
  requesterLoginId: string;
  requesterName: string;
  createComment: (input: {
    postId: string;
    authorLoginId: string;
    authorName: string;
    content: string;
    createdAt: string;
  }) => Promise<{
    id: string;
    postId: string;
    author: string;
    authorLoginId: string;
    authorName: string;
    content: string;
    createdAt: string;
  }>;
  now?: () => string;
};

export type CommentCreateResult =
  | {
      ok: true;
      comment: {
        id: string;
        postId: string;
        author: string;
        authorLoginId: string;
        authorName: string;
        content: string;
        createdAt: string;
      };
    }
  | { ok: false; code: "invalid_input" | "unauthorized"; message: string };

export const sanitizeCommentContent = (value: string): string =>
  value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();

export const runCommentCreateSteps = async (
  rawInput: unknown,
  context: CommentCreateStepsContext,
): Promise<CommentCreateResult> => {
  const parsed = parseCommentCreateInput(rawInput);
  if (!parsed.ok) {
    return { ok: false, code: parsed.code, message: parsed.message };
  }

  const requesterLoginId = context.requesterLoginId.trim();
  const requesterName = context.requesterName.trim();
  if (!requesterLoginId || !requesterName) {
    return { ok: false, code: "unauthorized", message: "unauthorized" };
  }

  const sanitized = sanitizeCommentContent(parsed.value.content);
  if (!sanitized) {
    return { ok: false, code: "invalid_input", message: "content is empty after sanitize" };
  }

  const createdAt = context.now ? context.now() : new Date().toISOString();
  const comment = await context.createComment({
    postId: parsed.value.postId,
    authorLoginId: requesterLoginId,
    authorName: requesterName,
    content: sanitized,
    createdAt,
  });

  return {
    ok: true,
    comment,
  };
};
