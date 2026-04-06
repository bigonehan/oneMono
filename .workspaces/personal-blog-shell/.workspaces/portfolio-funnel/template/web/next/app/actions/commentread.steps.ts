import { commentDb, type CommentRecord } from "../../lib/comment-db";
import {
  parseCommentReadInput,
  type CommentReadInput,
  type CommentReadMode,
} from "./commentread.schema";

type CommentReadRepository = {
  pageSize: number;
  ensureStorage?: () => Promise<void>;
  listByPost: (postId: string, page: number) => Promise<CommentRecord[]>;
};

type CommentReadStepsContext = {
  mode?: CommentReadMode;
  repository?: CommentReadRepository;
};

export type CommentReadResult =
  | { ok: true; postId: string; page: number; pageSize: number; comments: CommentRecord[] }
  | { ok: false; code: string; message: string };

const mapCommentContent = (comment: CommentRecord): CommentRecord => ({
  ...comment,
  content: comment.isDeleted ? "삭제된 댓글입니다." : comment.content,
});

export const runCommentReadSteps = async (
  rawInput: unknown,
  context: CommentReadStepsContext = {},
): Promise<CommentReadResult> => {
  const mode = context.mode ?? "initial";
  const parsed = parseCommentReadInput(rawInput, mode);
  if (parsed.ok === false) {
    return { ok: false, code: parsed.code, message: parsed.message };
  }

  const repository = context.repository ?? commentDb;
  if (repository.ensureStorage) {
    await repository.ensureStorage();
  }

  const input: CommentReadInput = parsed.value;
  const comments = await repository.listByPost(input.postId, input.page);

  return {
    ok: true,
    postId: input.postId,
    page: input.page,
    pageSize: Math.min(repository.pageSize, 20),
    comments: comments.map(mapCommentContent),
  };
};
