import * as assert from "node:assert/strict";
import { test } from "node:test";
import { parseCommentCreateInput } from "./commentcreate.schema";
import { runCommentCreateSteps } from "./commentcreate.steps";

test("commentcreate schema: reject blank and over-limit content", () => {
  const empty = parseCommentCreateInput({ postId: "post-1", content: "" });
  assert.equal(empty.ok, false);

  const blank = parseCommentCreateInput({ postId: "post-1", content: "   " });
  assert.equal(blank.ok, false);

  const long = parseCommentCreateInput({ postId: "post-1", content: "a".repeat(501) });
  assert.equal(long.ok, false);

  const max = parseCommentCreateInput({ postId: "post-1", content: "a".repeat(500) });
  assert.equal(max.ok, true);
});

test("commentcreate steps: reject sanitize-empty content", async () => {
  const result = await runCommentCreateSteps(
    { postId: "post-1", content: "<script>alert(1)</script>" },
    {
      requesterLoginId: "alice",
      requesterName: "Alice",
      createComment: async () => {
        throw new Error("should not be called");
      },
    },
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.code, "invalid_input");
});

test("commentcreate steps: reject unauthenticated requester", async () => {
  const result = await runCommentCreateSteps(
    { postId: "post-1", content: "hello" },
    {
      requesterLoginId: "",
      requesterName: "",
      createComment: async () => {
        throw new Error("should not be called");
      },
    },
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.code, "unauthorized");
});

test("commentcreate steps: save sanitized content with required fields", async () => {
  const result = await runCommentCreateSteps(
    { postId: "post-1", content: "hello <b>world</b>" },
    {
      requesterLoginId: "alice",
      requesterName: "Alice",
      now: () => "2026-03-08T00:00:00.000Z",
      createComment: async (input) => ({
        id: "cmt-1",
        postId: input.postId,
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

  assert.equal(result.comment.author, "alice");
  assert.equal(result.comment.postId, "post-1");
  assert.equal(result.comment.content, "hello world");
  assert.equal(result.comment.createdAt, "2026-03-08T00:00:00.000Z");
});
