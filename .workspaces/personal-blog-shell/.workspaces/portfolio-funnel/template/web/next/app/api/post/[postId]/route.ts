import type { ArticleRule, NewArticle } from "@domain/article";
import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../lib/auth-session";
import { postAdapter } from "../../../../lib/post-adapter";

type PostPayload = {
  title?: string;
  body?: string;
  rule?: string;
};

const isArticleRule = (value: string): value is ArticleRule =>
  value === "public" || value === "private" || value === "protected";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  const found = await postAdapter.getArticleWithAuthorById(postId);

  if (!found) {
    return NextResponse.json({ ok: false, message: "not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    post: {
      ...found.article,
      authorLoginId: found.authorLoginId,
      authorName: found.authorName,
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  const { postId } = await params;

  let payload: PostPayload;
  try {
    payload = (await request.json()) as PostPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "invalid payload" }, { status: 400 });
  }

  const patch: Partial<NewArticle> = {};

  if (typeof payload.title === "string") {
    patch.title = payload.title.trim();
  }
  if (typeof payload.body === "string") {
    patch.body = payload.body.trim();
  }
  if (typeof payload.rule === "string") {
    const rule = payload.rule.trim();
    if (!isArticleRule(rule)) {
      return NextResponse.json({ ok: false, message: "invalid rule" }, { status: 400 });
    }
    patch.rule = rule;
  }

  const updated = await postAdapter.updateArticleByAuthor(postId, patch, user.loginId);
  if (!updated) {
    return NextResponse.json({ ok: false, message: "not found or forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    post: {
      ...updated.article,
      authorLoginId: updated.authorLoginId,
      authorName: updated.authorName,
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  const { postId } = await params;
  const deleted = await postAdapter.deleteArticleByAuthor(postId, user.loginId);

  if (!deleted) {
    return NextResponse.json({ ok: false, message: "not found or forbidden" }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
