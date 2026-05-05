import { NextResponse } from "next/server";
import { ensureSeedCommentForPost, listCommentsByPostId } from "../../../lib/comment-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId")?.trim() ?? "";
  const authorLoginId = searchParams.get("authorLoginId")?.trim() ?? "unknown";
  const authorName = searchParams.get("authorName")?.trim() ?? "unknown";

  if (!postId) {
    return NextResponse.json({ ok: false, message: "postId is required", comments: [] }, { status: 400 });
  }

  ensureSeedCommentForPost({ postId, authorLoginId, authorName });
  const comments = listCommentsByPostId(postId);

  return NextResponse.json({
    ok: true,
    comments: comments.map((comment) => ({
      id: comment.id,
      postId: comment.postId,
      authorLoginId: comment.authorLoginId,
      authorName: comment.authorName,
      content: comment.isDeleted ? "삭제된 댓글입니다." : comment.content,
      createdAt: comment.createdAt,
      isDeleted: comment.isDeleted,
    })),
  });
}
