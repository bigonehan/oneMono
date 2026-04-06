export type CommentReplyCreateInput = {
  parentId: string;
  postId: string;
  authorLoginId: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type CommentReplyCreateResult = {
  id: string;
  postId: string;
  parentId: string;
  author: string;
  authorLoginId: string;
  authorName: string;
  content: string;
  createdAt: string;
};

type CommentReplyParent = {
  id: string;
  postId: string;
  isDeleted?: boolean;
};

type CommentReplyRepository = {
  findById: (commentId: string) => Promise<CommentReplyParent | null>;
  create: (input: CommentReplyCreateInput) => Promise<CommentReplyCreateResult>;
};

export type CreateCommentReplyResult =
  | { ok: true; comment: CommentReplyCreateResult }
  | { ok: false; code: "not_found" | "invalid_parent"; message: string };

export const createCommentReply = async (
  input: CommentReplyCreateInput,
  repository: CommentReplyRepository,
): Promise<CreateCommentReplyResult> => {
  const foundParent = await repository.findById(input.parentId);
  if (!foundParent || foundParent.isDeleted) {
    return { ok: false, code: "not_found", message: "parent comment not found" };
  }

  if (foundParent.postId !== input.postId) {
    return { ok: false, code: "invalid_parent", message: "parent comment post mismatch" };
  }

  const created = await repository.create(input);
  return {
    ok: true,
    comment: created,
  };
};
