import { NextResponse } from "next/server";
import { runCommentCreateSteps } from "../../../../actions/commentcreate.steps";
import { runCommentReadSteps } from "../../../../actions/commentread.steps";
import { getSessionUser } from "../../../../../lib/auth-session";
import { commentDb } from "../../../../../lib/comment-db";
import { postAdapter } from "../../../../../lib/post-adapter";

type Params = { postId: string };

type CommentCreatePayload = {
  postId?: string;
  content?: string;
};

const parsePage = (value: string | null): number | null => {
  if (value === null) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> },
) {
  const { postId } = await params;
  const page = parsePage(new URL(request.url).searchParams.get("page"));

  if (page === null) {
    return NextResponse.json({ ok: false, message: "invalid page" }, { status: 400 });
  }

  const result = await runCommentReadSteps(
    { postId, page },
    { mode: page >= 2 ? "append" : "initial" },
  );
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result, { status: 200 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<Params> },
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  const { postId } = await params;
  const trimmedPostId = postId.trim();
  if (!trimmedPostId) {
    return NextResponse.json({ ok: false, message: "invalid postId" }, { status: 400 });
  }

  let payload: CommentCreatePayload;
  try {
    const raw = (await request.json()) as unknown;
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ ok: false, message: "invalid payload" }, { status: 400 });
    }
    payload = raw as CommentCreatePayload;
  } catch {
    return NextResponse.json({ ok: false, message: "invalid payload" }, { status: 400 });
  }

  if (typeof payload.postId === "string" && payload.postId.trim() !== trimmedPostId) {
    return NextResponse.json({ ok: false, message: "postId mismatch" }, { status: 400 });
  }

  const foundPost = await postAdapter.getArticleWithAuthorById(trimmedPostId);
  if (!foundPost) {
    return NextResponse.json({ ok: false, message: "post not found" }, { status: 404 });
  }

  await commentDb.ensureStorage();

  const result = await runCommentCreateSteps(
    {
      postId: trimmedPostId,
      content: payload.content,
    },
    {
      requesterLoginId: user.loginId,
      requesterName: user.name,
      createComment: async (input) =>
        commentDb.create({
          postId: input.postId,
          parentId: null,
          author: input.authorLoginId,
          authorLoginId: input.authorLoginId,
          authorName: input.authorName,
          content: input.content,
          createdAt: input.createdAt,
        }),
    },
  );

  if (!result.ok) {
    const status = result.code === "unauthorized" ? 401 : 400;
    return NextResponse.json({ ok: false, code: result.code, message: result.message }, { status });
  }

  return NextResponse.json({ ok: true, comment: result.comment }, { status: 201 });
}
