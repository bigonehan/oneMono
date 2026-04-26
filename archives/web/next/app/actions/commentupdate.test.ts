import * as assert from "node:assert/strict";
import { test } from "node:test";
import { createInMemoryCommentRepository } from "../../lib/comment-repository";
import { runCommentUpdateSteps } from "./commentupdate.steps";

const baseComment = {
  commentId: "cmt_1",
  postId: "pst_1",
  authorLoginId: "alice",
  content: "before",
  createdAt: "2026-03-07T00:00:00.000Z",
  updatedAt: "2026-03-07T00:00:00.000Z",
};

test("commentupdate: invalid input when content is blank", async () => {
  const repository = createInMemoryCommentRepository([baseComment]);
  const result = await runCommentUpdateSteps(
    { commentId: "cmt_1", content: "   " },
    { requesterLoginId: "alice", repository },
  );

  assert.equal(result.ok, false);
  if (result.ok !== false) {
    return;
  }

  assert.equal(result.code, "invalid_input");
});

test("commentupdate: invalid input when commentId format is invalid", async () => {
  const repository = createInMemoryCommentRepository([baseComment]);
  const result = await runCommentUpdateSteps(
    { commentId: "x", content: "after" },
    { requesterLoginId: "alice", repository },
  );

  assert.equal(result.ok, false);
  if (result.ok !== false) {
    return;
  }

  assert.equal(result.code, "invalid_input");
});

test("commentupdate: forbidden when requester is not comment author", async () => {
  const repository = createInMemoryCommentRepository([baseComment]);
  const result = await runCommentUpdateSteps(
    { commentId: "cmt_1", content: "after" },
    { requesterLoginId: "bob", repository },
  );

  assert.equal(result.ok, false);
  if (result.ok !== false) {
    return;
  }

  assert.equal(result.code, "forbidden");
});

test("commentupdate: success updates content and updatedAt", async () => {
  const repository = createInMemoryCommentRepository([baseComment]);
  const result = await runCommentUpdateSteps(
    { commentId: "cmt_1", content: "after" },
    { requesterLoginId: "alice", repository },
  );

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  assert.equal(result.comment.content, "after");
  assert.notEqual(result.comment.updatedAt, baseComment.updatedAt);
});
