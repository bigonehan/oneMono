import { NextResponse } from "next/server";
import { commentreply } from "../../../../actions/commentreply";
import { getSessionUser } from "../../../../../lib/auth-session";
import { commentDb } from "../../../../../lib/comment-db";

type Params = { commentId: string };

type CommentReplyPayload = {
  postId?: string;
  content?: string;
};

const toStatus = (result: Awaited<ReturnType<typeof commentreply>>): number => {
  if (result.ok) {
    return 201;
  }

  if (result.code === "unauthorized") {
    return 401;
  }

  if (result.code === "not_found") {
    return 404;
  }

  if (result.code === "invalid_parent") {
    return 409;
  }

  return 400;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<Params> },
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, code: "unauthorized", message: "unauthorized" }, { status: 401 });
  }

  const { commentId } = await params;
  const normalizedParentId = commentId.trim();
  if (!normalizedParentId) {
    return NextResponse.json({ ok: false, code: "invalid_input", message: "parentId is required" }, { status: 400 });
  }

  let payload: CommentReplyPayload;
  try {
    payload = (await request.json()) as CommentReplyPayload;
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_input", message: "invalid payload" }, { status: 400 });
  }

  await commentDb.ensureStorage();

  const result = await commentreply(
    {
      parentId: normalizedParentId,
      postId: payload.postId,
      content: payload.content,
    },
    {
      requesterLoginId: user.loginId,
      requesterName: user.name,
      findCommentById: async (commentId) => {
        const found = await commentDb.findById(commentId);
        if (!found) {
          return null;
        }

        return {
          id: found.id,
          postId: found.postId,
          isDeleted: found.isDeleted,
        };
      },
      createComment: async (input) =>
        commentDb.create({
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

  return NextResponse.json(result, { status: toStatus(result) });
}
