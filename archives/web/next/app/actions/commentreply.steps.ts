import { createCommentReply } from "../../lib/comment-reply";
import { parseCommentReplyInput } from "./commentreply.schema";

type CommentReplyStepsContext = {
  requesterLoginId: string;
  requesterName: string;
  findCommentById: (commentId: string) => Promise<{ id: string; postId: string; isDeleted?: boolean } | null>;
  createComment: (input: {
    parentId: string;
    postId: string;
    authorLoginId: string;
    authorName: string;
    content: string;
    createdAt: string;
  }) => Promise<{
    id: string;
    postId: string;
    parentId: string;
    author: string;
    authorLoginId: string;
    authorName: string;
    content: string;
    createdAt: string;
  }>;
  now?: () => string;
};

export type CommentReplyResult =
  | {
      ok: true;
      comment: {
        id: string;
        postId: string;
        parentId: string;
        author: string;
        authorLoginId: string;
        authorName: string;
        content: string;
        createdAt: string;
      };
    }
  | {
      ok: false;
      code: "invalid_input" | "unauthorized" | "not_found" | "invalid_parent";
      message: string;
    };

const sanitizeCommentContent = (value: string): string =>
  value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();

export const runCommentReplySteps = async (
  rawInput: unknown,
  context: CommentReplyStepsContext,
): Promise<CommentReplyResult> => {
  const parsed = parseCommentReplyInput(rawInput);
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
  const created = await createCommentReply(
    {
      parentId: parsed.value.parentId,
      postId: parsed.value.postId,
      authorLoginId: requesterLoginId,
      authorName: requesterName,
      content: sanitized,
      createdAt,
    },
    {
      findById: context.findCommentById,
      create: context.createComment,
    },
  );

  if (!created.ok) {
    return created;
  }

  return {
    ok: true,
    comment: created.comment,
  };
};
