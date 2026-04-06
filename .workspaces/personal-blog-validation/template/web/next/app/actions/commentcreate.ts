"use server";

import {
  runCommentCreateSteps,
  type CommentCreateResult,
} from "./commentcreate.steps";

type CommentCreateActionContext = {
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
};

export const commentcreate = async (
  input: unknown,
  context: CommentCreateActionContext,
): Promise<CommentCreateResult> =>
  runCommentCreateSteps(input, {
    requesterLoginId: context.requesterLoginId,
    requesterName: context.requesterName,
    createComment: context.createComment,
  });
