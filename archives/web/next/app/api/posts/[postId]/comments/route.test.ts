import * as assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { signAuthToken } from "../../../../../lib/auth-jwt";
import { createUser } from "../../../../../lib/auth-store";

const createPostMarkdown = (postId: string): string => {
  const now = "2026-03-09T00:00:00.000Z";
  const frontmatter = JSON.stringify({
    id: postId,
    title: "post",
    rule: "public",
    created_at: now,
    modified_at: now,
    authorLoginId: "author",
    authorName: "Author",
  });

  return `---\n${frontmatter}\n---\nbody\n`;
};

const createAuthorizedCookie = async (seed: string): Promise<string> => {
  const user = createUser({
    loginId: `user_${seed}`,
    name: `User ${seed}`,
    pw: "pw",
  });
  assert.ok(user, "test user must be created");

  const token = await signAuthToken({
    sub: user.userId,
    loginId: user.loginId,
    name: user.name,
  });

  return `auth_token=${token}`;
};

let root = "";
let postDir = "";
let commentDir = "";
let POST: (typeof import("./route"))["POST"];

before(async () => {
  root = await mkdtemp(path.join(tmpdir(), "commentcreate-route-"));
  postDir = path.join(root, "posts");
  commentDir = path.join(root, "comments");
  await mkdir(postDir, { recursive: true });
  await mkdir(commentDir, { recursive: true });
  process.env.POST_STORAGE_DIR = postDir;
  process.env.COMMENT_STORAGE_DIR = commentDir; // eslint-disable-line turbo/no-undeclared-env-vars
  ({ POST } = await import("./route"));
});

after(async () => {
  await rm(root, { recursive: true, force: true });
});

const ensurePost = async (postId: string): Promise<void> => {
  await writeFile(path.join(postDir, `${postId}.md`), createPostMarkdown(postId), "utf8");
};

test("POST /api/posts/[postId]/comments: unauthorized request returns 401", async () => {
  const postId = "post_unauth_1";
  await ensurePost(postId);

  const request = new Request("http://localhost/api/posts/post/comments", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ postId, content: "hello" }),
  });

  const response = await POST(request, { params: Promise.resolve({ postId }) });
  assert.equal(response.status, 401);
});

test("POST /api/posts/[postId]/comments: invalid/missing postId returns 400/404", async () => {
  const cookie = await createAuthorizedCookie("missing-post");

  const invalidIdRequest = new Request("http://localhost/api/posts/invalid/comments", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie,
    },
    body: JSON.stringify({ postId: " ", content: "hello" }),
  });
  const invalidIdResponse = await POST(invalidIdRequest, { params: Promise.resolve({ postId: " " }) });
  assert.equal(invalidIdResponse.status, 400);

  const missingPostRequest = new Request("http://localhost/api/posts/missing/comments", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie,
    },
    body: JSON.stringify({ postId: "missing_post_1", content: "hello" }),
  });
  const missingPostResponse = await POST(missingPostRequest, {
    params: Promise.resolve({ postId: "missing_post_1" }),
  });
  assert.equal(missingPostResponse.status, 404);
});

test("POST /api/posts/[postId]/comments: sanitize + create stores required fields", async () => {
  const postId = "post_success_1";
  await ensurePost(postId);
  const cookie = await createAuthorizedCookie("success");

  const request = new Request("http://localhost/api/posts/success/comments", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie,
    },
    body: JSON.stringify({
      postId,
      content: "  <b>hello</b><script>alert(1)</script>  ",
    }),
  });

  const response = await POST(request, { params: Promise.resolve({ postId }) });
  assert.equal(response.status, 201);
  const data = (await response.json()) as {
    ok: boolean;
    comment?: {
      postId: string;
      author: string;
      content: string;
      createdAt: string;
    };
  };

  assert.equal(data.ok, true);
  assert.equal(data.comment?.postId, postId);
  assert.equal(data.comment?.author.startsWith("user_success"), true);
  assert.equal(data.comment?.content, "hello");
  assert.ok(typeof data.comment?.createdAt === "string" && data.comment.createdAt.length > 0);

  const storedRaw = await readFile(path.join(commentDir, "comments.json"), "utf8");
  const stored = JSON.parse(storedRaw) as Array<{
    postId: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
  assert.equal(stored.length, 1);
  assert.equal(stored[0]?.postId, postId);
  assert.equal(stored[0]?.author.startsWith("user_success"), true);
  assert.equal(stored[0]?.content, "hello");
  assert.ok(typeof stored[0]?.createdAt === "string" && stored[0].createdAt.length > 0);
});
