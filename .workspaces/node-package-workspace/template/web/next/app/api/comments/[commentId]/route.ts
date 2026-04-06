import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../lib/auth-session";
import { commentDb } from "../../../../lib/comment-db";
import { commentupdate } from "../../../actions/commentupdate";
import { type CommentUpdateRepository, type CommentUpdateResult } from "../../../actions/commentupdate.steps";
import {
  type CommentDeleteResult,
  executeCommentDelete,
} from "../../../../src/app/actions/commentdelete";

const toDeleteStatus = (result: CommentDeleteResult): number => {
  if (result.ok) {
    return 200;
  }
  if (result.code === "invalid_id") {
    return 400;
  }
  if (result.code === "unauthorized") {
    return 401;
  }
  if (result.code === "forbidden") {
    return 403;
  }
  if (result.code === "not_found") {
    return 404;
  }
  return 500;
};

const toUpdateStatus = (result: CommentUpdateResult): number => {
  if (result.ok) {
    return 200;
  }
  if (result.code === "invalid_input") {
    return 400;
  }
  if (result.code === "forbidden") {
    return 403;
  }
  if (result.code === "not_found") {
    return 404;
  }
  return 500;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const user = await getSessionUser(request);
  const { commentId } = await params;
  const body = (await request.json().catch(() => ({}))) as { content?: unknown };
  await commentDb.ensureStorage();

  const repository: CommentUpdateRepository = {
    getById: async (id) => {
      const found = await commentDb.findById(id);
      if (!found) {
        return null;
      }

      return {
        commentId: found.id,
        postId: found.postId,
        authorLoginId: found.authorLoginId,
        content: found.content,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt ?? found.createdAt,
      };
    },
    updateById: async (id, input) => {
      const updated = await commentDb.updateById(id, { content: input.content });
      if (!updated) {
        return null;
      }

      return {
        commentId: updated.id,
        postId: updated.postId,
        authorLoginId: updated.authorLoginId,
        content: updated.content,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt ?? updated.createdAt,
      };
    },
  };

  const result = await commentupdate(
    {
      commentId,
      content: body.content,
    },
    {
      requesterLoginId: user?.loginId ?? "",
      repository,
    },
  );

  return NextResponse.json(result, { status: toUpdateStatus(result) });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const user = await getSessionUser(request);
  const { commentId } = await params;
  await commentDb.ensureStorage();

  const result = await executeCommentDelete(
    {
      commentId,
      requesterLoginId: user?.loginId ?? "",
      requesterIsAdmin: user?.loginId === "admin",
    },
    {
      findCommentById: async (id) => {
        const found = await commentDb.findById(id);
        if (!found) {
          return null;
        }
        return {
          id: found.id,
          authorLoginId: found.authorLoginId,
          isDeleted: found.isDeleted === true,
        };
      },
      softDeleteCommentById: async (id) => (await commentDb.softDeleteById(id)) !== null,
    },
  );

  return NextResponse.json(result, { status: toDeleteStatus(result) });
}
