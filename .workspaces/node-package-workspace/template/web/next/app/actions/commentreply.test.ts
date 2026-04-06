import * as assert from "node:assert/strict";
import { test } from "node:test";
import { parseCommentReplyInput } from "./commentreply.schema";
import { runCommentReplySteps } from "./commentreply.steps";

test("commentreply schema: reject blank and over-limit content", () => {
  const blank = parseCommentReplyInput({ parentId: "cmt-1", postId: "post-1", content: "   " });
  assert.equal(blank.ok, false);

  const long = parseCommentReplyInput({
    parentId: "cmt-1",
    postId: "post-1",
    content: "a".repeat(501),
  });
  assert.equal(long.ok, false);
});

test("commentreply steps: reject when parent not found", async () => {
  const result = await runCommentReplySteps(
    { parentId: "cmt-404", postId: "post-1", content: "reply" },
    {
      requesterLoginId: "alice",
      requesterName: "Alice",
      findCommentById: async () => null,
      createComment: async () => {
        throw new Error("should not be called");
      },
    },
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.code, "not_found");
});

test("commentreply steps: save sanitized content with parentId", async () => {
  const result = await runCommentReplySteps(
    { parentId: "cmt-parent", postId: "post-1", content: "hello <b>reply</b>" },
    {
      requesterLoginId: "alice",
      requesterName: "Alice",
      now: () => "2026-03-08T01:00:00.000Z",
      findCommentById: async (commentId) =>
        commentId === "cmt-parent" ? { id: "cmt-parent", postId: "post-1" } : null,
      createComment: async (input) => ({
        id: "cmt-reply-1",
        postId: input.postId,
        parentId: input.parentId,
        author: input.authorLoginId,
        authorLoginId: input.authorLoginId,
        authorName: input.authorName,
        content: input.content,
        createdAt: input.createdAt,
      }),
    },
  );

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  assert.equal(result.comment.parentId, "cmt-parent");
  assert.equal(result.comment.content, "hello reply");
  assert.equal(result.comment.createdAt, "2026-03-08T01:00:00.000Z");
});
