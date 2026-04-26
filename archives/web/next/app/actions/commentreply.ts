"use server";

import {
  runCommentReplySteps,
  type CommentReplyResult,
} from "./commentreply.steps";

type CommentReplyActionContext = {
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
};

export const commentreply = async (
  input: unknown,
  context: CommentReplyActionContext,
): Promise<CommentReplyResult> =>
  runCommentReplySteps(input, {
    requesterLoginId: context.requesterLoginId,
    requesterName: context.requesterName,
    findCommentById: context.findCommentById,
    createComment: context.createComment,
  });
