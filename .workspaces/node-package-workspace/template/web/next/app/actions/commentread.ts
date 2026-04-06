"use server";

import {
  runCommentReadSteps,
  type CommentReadResult,
} from "./commentread.steps";

type CommentReadActionContext = {
  mode?: "initial" | "append";
};

export const commentread = async (
  input: unknown,
  context: CommentReadActionContext = {},
): Promise<CommentReadResult> => runCommentReadSteps(input, { mode: context.mode ?? "initial" });
