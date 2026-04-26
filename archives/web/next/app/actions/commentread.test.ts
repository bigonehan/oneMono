import * as assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseCommentReadInput,
  type CommentReadInput,
} from "./commentread.schema";
import { runCommentReadSteps } from "./commentread.steps";

const baseComments = [
  {
    id: "cmt_1",
    postId: "pst_1",
    authorLoginId: "alice",
    authorName: "Alice",
    content: "A",
    createdAt: "2026-03-07T00:00:00.000Z",
  },
  {
    id: "cmt_2",
    postId: "pst_1",
    authorLoginId: "bob",
    authorName: "Bob",
    content: "B",
    createdAt: "2026-03-07T01:00:00.000Z",
    isDeleted: true,
  },
];

test("commentread schema: append mode requires page >= 2", () => {
  const result = parseCommentReadInput({ postId: "pst_1", page: 1 }, "append");
  assert.equal(result.ok, false);
  if (result.ok !== false) {
    return;
  }

  assert.equal(result.code, "invalid_append_page");
});

test("commentread steps: returns page-limited data and masks deleted content", async () => {
  const repository = {
    pageSize: 20,
    listByPost: async (postId: string, page: number) => {
      assert.equal(postId, "pst_1");
      assert.equal(page, 1);
      return baseComments;
    },
  };

  const result = await runCommentReadSteps({ postId: "pst_1", page: 1 } satisfies CommentReadInput, {
    mode: "initial",
    repository,
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  assert.equal(result.pageSize, 20);
  assert.equal(result.comments.length, 2);
  assert.equal(result.comments[1].content, "삭제된 댓글입니다.");
});
