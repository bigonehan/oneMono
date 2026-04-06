import type { ArticleRule, NewArticle } from "@domain/article";
import { NextResponse } from "next/server";
import { getSessionUser } from "../../../lib/auth-session";
import { postAdapter } from "../../../lib/post-adapter";

type PostPayload = {
  title?: string;
  body?: string;
  rule?: string;
};

const isArticleRule = (value: string): value is ArticleRule =>
  value === "public" || value === "private" || value === "protected";

export async function GET() {
  const rows = await postAdapter.listArticlesWithAuthor();

  return NextResponse.json({
    ok: true,
    posts: rows.map((row) => ({
      ...row.article,
      authorLoginId: row.authorLoginId,
      authorName: row.authorName,
    })),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  let payload: PostPayload;
  try {
    payload = (await request.json()) as PostPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "invalid payload" }, { status: 400 });
  }

  const title = payload.title?.trim();
  const body = payload.body?.trim();
  const rule = payload.rule?.trim();

  if (!title || !body || !rule || !isArticleRule(rule)) {
    return NextResponse.json({ ok: false, message: "title, body, rule are required" }, { status: 400 });
  }

  const input: NewArticle = { title, body, rule };
  const created = await postAdapter.createArticleByAuthor(input, {
    loginId: user.loginId,
    name: user.name,
  });

  return NextResponse.json({
    ok: true,
    post: {
      ...created.article,
      authorLoginId: created.authorLoginId,
      authorName: created.authorName,
    },
  });
}
