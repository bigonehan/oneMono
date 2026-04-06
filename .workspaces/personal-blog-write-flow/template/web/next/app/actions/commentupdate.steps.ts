import {
  commentRepository,
  type StoredComment,
} from "../../lib/comment-repository";
import { parseCommentUpdateInput } from "./commentupdate.schema";

export type CommentUpdateRepository = {
  getById(commentId: string): StoredComment | Promise<StoredComment | null> | null;
  updateById(
    commentId: string,
    input: { content: string },
  ): StoredComment | Promise<StoredComment | null> | null;
};

type CommentUpdateStepsContext = {
  requesterLoginId: string;
  repository?: CommentUpdateRepository;
};

export type CommentUpdateResult =
  | { ok: true; comment: StoredComment }
  | { ok: false; code: "invalid_input" | "not_found" | "forbidden"; message: string };

export const runCommentUpdateSteps = async (
  rawInput: unknown,
  context: CommentUpdateStepsContext,
): Promise<CommentUpdateResult> => {
  const parsed = parseCommentUpdateInput(rawInput);
  if (parsed.ok === false) {
    return { ok: false, code: parsed.code, message: parsed.message };
  }

  const requesterLoginId = context.requesterLoginId.trim();
  if (!requesterLoginId) {
    return { ok: false, code: "forbidden", message: "requesterLoginId is required" };
  }

  const repository = context.repository ?? commentRepository;

  const found = await repository.getById(parsed.value.commentId);
  if (!found) {
    return { ok: false, code: "not_found", message: "comment not found" };
  }

  if (found.authorLoginId !== requesterLoginId) {
    return { ok: false, code: "forbidden", message: "forbidden" };
  }

  const updated = await repository.updateById(found.commentId, { content: parsed.value.content });
  if (!updated) {
    return { ok: false, code: "not_found", message: "comment not found" };
  }

  return { ok: true, comment: updated };
};
