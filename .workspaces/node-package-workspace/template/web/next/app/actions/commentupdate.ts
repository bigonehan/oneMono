"use server";

import {
  runCommentUpdateSteps,
  type CommentUpdateRepository,
  type CommentUpdateResult,
} from "./commentupdate.steps";

type CommentUpdateActionContext = {
  requesterLoginId: string;
  repository?: CommentUpdateRepository;
};

export const commentupdate = async (
  input: unknown,
  context: CommentUpdateActionContext,
): Promise<CommentUpdateResult> =>
  runCommentUpdateSteps(input, {
    requesterLoginId: context.requesterLoginId,
    repository: context.repository,
  });
