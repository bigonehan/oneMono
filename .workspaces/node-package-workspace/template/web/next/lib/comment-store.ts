export type StoredComment = {
  id: string;
  postId: string;
  authorLoginId: string;
  authorName: string;
  content: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
};

const commentsById = new Map<string, StoredComment>();
const commentIdsByPostId = new Map<string, string[]>();
const seededPostIds = new Set<string>();

const createCommentId = (): string => {
  const rand = Math.random().toString(36).slice(2, 10);
  return `cmt_${Date.now()}_${rand}`;
};

const appendComment = (comment: StoredComment) => {
  commentsById.set(comment.id, comment);
  const list = commentIdsByPostId.get(comment.postId) ?? [];
  commentIdsByPostId.set(comment.postId, [...list, comment.id]);
};

export const ensureSeedCommentForPost = (input: {
  postId: string;
  authorLoginId: string;
  authorName: string;
}) => {
  const postId = input.postId.trim();
  if (!postId || seededPostIds.has(postId)) {
    return;
  }

  seededPostIds.add(postId);
  appendComment({
    id: createCommentId(),
    postId,
    authorLoginId: input.authorLoginId,
    authorName: input.authorName,
    content: "샘플 댓글입니다.",
    createdAt: new Date().toISOString(),
    isDeleted: false,
    deletedAt: null,
  });
};

export const listCommentsByPostId = (postId: string): StoredComment[] => {
  const ids = commentIdsByPostId.get(postId) ?? [];
  return ids
    .map((id) => commentsById.get(id))
    .filter((item): item is StoredComment => item !== undefined)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
};

export const findCommentById = (commentId: string): StoredComment | null =>
  commentsById.get(commentId) ?? null;

export const softDeleteCommentById = (commentId: string): boolean => {
  const found = commentsById.get(commentId);
  if (!found || found.isDeleted) {
    return false;
  }

  commentsById.set(commentId, {
    ...found,
    isDeleted: true,
    deletedAt: new Date().toISOString(),
  });
  return true;
};
