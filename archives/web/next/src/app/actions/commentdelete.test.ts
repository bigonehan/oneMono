import * as assert from "node:assert/strict";
import { test } from "node:test";
import { executeCommentDelete, type CommentDeleteEntity } from "./commentdelete";

const baseComment: CommentDeleteEntity = {
  id: "cmt_1",
  authorLoginId: "alice",
  isDeleted: false,
};

const createDeps = (comment: CommentDeleteEntity | null, deleted = true) => ({
  findCommentById: async () => comment,
  softDeleteCommentById: async () => deleted,
});

test("commentdelete: invalid id returns invalid_id", async () => {
  const result = await executeCommentDelete(
    { commentId: "x", requesterLoginId: "alice", requesterIsAdmin: false },
    createDeps(baseComment),
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.code, "invalid_id");
});

test("commentdelete: empty requester returns unauthorized", async () => {
  const result = await executeCommentDelete(
    { commentId: "cmt_1", requesterLoginId: " ", requesterIsAdmin: false },
    createDeps(baseComment),
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.code, "unauthorized");
});

test("commentdelete: non-owner and non-admin returns forbidden", async () => {
  const result = await executeCommentDelete(
    { commentId: "cmt_1", requesterLoginId: "bob", requesterIsAdmin: false },
    createDeps(baseComment),
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.code, "forbidden");
});

test("commentdelete: missing comment returns not_found", async () => {
  const result = await executeCommentDelete(
    { commentId: "cmt_1", requesterLoginId: "alice", requesterIsAdmin: false },
    createDeps(null),
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.code, "not_found");
});

test("commentdelete: owner delete success returns deleted", async () => {
  const result = await executeCommentDelete(
    { commentId: "cmt_1", requesterLoginId: "alice", requesterIsAdmin: false },
    createDeps(baseComment, true),
  );

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  assert.equal(result.code, "deleted");
  assert.equal(result.commentId, "cmt_1");
});
