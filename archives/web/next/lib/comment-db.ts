import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type CommentRecord = {
  id: string;
  postId: string;
  parentId?: string | null;
  author: string;
  authorLoginId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
};

const COMMENT_PAGE_SIZE = 20;
const defaultRootDir = path.resolve(process.cwd(), ".data", "comments");
// eslint-disable-next-line turbo/no-undeclared-env-vars
const commentRootDir = process.env.COMMENT_STORAGE_DIR ?? defaultRootDir;
const commentFilePath = path.join(commentRootDir, "comments.json");

const parseCreatedAt = (value: string): number => {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const createCommentId = (): string => {
  const rand = Math.random().toString(36).slice(2, 10);
  return `cmt_${Date.now()}_${rand}`;
};

const readAllComments = async (): Promise<CommentRecord[]> => {
  try {
    const raw = await readFile(commentFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((row) => {
      if (!row || typeof row !== "object") {
        return [];
      }

      const candidate = row as Partial<CommentRecord>;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.postId !== "string" ||
        (candidate.parentId !== undefined &&
          candidate.parentId !== null &&
          typeof candidate.parentId !== "string") ||
        typeof candidate.authorLoginId !== "string" ||
        typeof candidate.authorName !== "string" ||
        typeof candidate.content !== "string" ||
        typeof candidate.createdAt !== "string" ||
        (candidate.updatedAt !== undefined && typeof candidate.updatedAt !== "string") ||
        (candidate.isDeleted !== undefined && typeof candidate.isDeleted !== "boolean") ||
        (candidate.deletedAt !== undefined &&
          candidate.deletedAt !== null &&
          typeof candidate.deletedAt !== "string")
      ) {
        return [];
      }

      return [
        {
          ...candidate,
          parentId:
            typeof candidate.parentId === "string" && candidate.parentId.trim()
              ? candidate.parentId
              : null,
          author:
            typeof candidate.author === "string" && candidate.author.trim()
              ? candidate.author
              : candidate.authorLoginId,
        } satisfies CommentRecord,
      ];
    });
  } catch {
    return [];
  }
};

const writeAllComments = async (comments: CommentRecord[]): Promise<void> => {
  await ensureStorage();
  await writeFile(commentFilePath, JSON.stringify(comments, null, 2), "utf8");
};

const listByPost = async (postId: string, page: number): Promise<CommentRecord[]> => {
  const comments = await readAllComments();
  const sorted = comments
    .filter((comment) => comment.postId === postId)
    .sort((left, right) => parseCreatedAt(left.createdAt) - parseCreatedAt(right.createdAt));

  const offset = (page - 1) * COMMENT_PAGE_SIZE;
  return sorted.slice(offset, offset + COMMENT_PAGE_SIZE);
};

const findById = async (commentId: string): Promise<CommentRecord | null> => {
  const comments = await readAllComments();
  return comments.find((comment) => comment.id === commentId) ?? null;
};

const updateById = async (
  commentId: string,
  input: { content: string },
): Promise<CommentRecord | null> => {
  const comments = await readAllComments();
  const index = comments.findIndex((comment) => comment.id === commentId);
  if (index < 0) {
    return null;
  }

  const found = comments[index];
  if (found.isDeleted) {
    return null;
  }

  const updatedComment: CommentRecord = {
    ...found,
    content: input.content,
    updatedAt: new Date().toISOString(),
  };
  comments[index] = updatedComment;
  await writeAllComments(comments);
  return updatedComment;
};

const softDeleteById = async (commentId: string): Promise<CommentRecord | null> => {
  const comments = await readAllComments();
  const index = comments.findIndex((comment) => comment.id === commentId);
  if (index < 0) {
    return null;
  }

  const found = comments[index];
  if (found.isDeleted) {
    return null;
  }

  const deletedComment: CommentRecord = {
    ...found,
    isDeleted: true,
    deletedAt: new Date().toISOString(),
  };
  comments[index] = deletedComment;
  await writeAllComments(comments);
  return deletedComment;
};

const create = async (input: {
  postId: string;
  parentId?: string | null;
  author: string;
  authorLoginId: string;
  authorName: string;
  content: string;
  createdAt?: string;
}): Promise<CommentRecord> => {
  const comments = await readAllComments();
  const next: CommentRecord = {
    id: createCommentId(),
    postId: input.postId,
    parentId:
      typeof input.parentId === "string" && input.parentId.trim()
        ? input.parentId.trim()
        : null,
    author: input.author,
    authorLoginId: input.authorLoginId,
    authorName: input.authorName,
    content: input.content,
    createdAt: input.createdAt ?? new Date().toISOString(),
    isDeleted: false,
    deletedAt: null,
  };
  comments.push(next);
  await writeAllComments(comments);
  return next;
};

const ensureStorage = async (): Promise<void> => {
  await mkdir(commentRootDir, { recursive: true });
};

export const commentDb = {
  pageSize: COMMENT_PAGE_SIZE,
  ensureStorage,
  listByPost,
  findById,
  updateById,
  softDeleteById,
  create,
};

export type { CommentRecord };
