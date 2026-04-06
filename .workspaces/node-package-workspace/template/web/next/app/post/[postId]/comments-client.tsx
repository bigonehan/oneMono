"use client";

import { type FormEvent, useMemo, useState } from "react";
import { requestCommentDelete } from "../../../src/app/actions/commentdelete";

type CommentRecord = {
  id: string;
  postId: string;
  parentId?: string | null;
  authorLoginId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
};

type CommentListResponse = {
  ok: boolean;
  page: number;
  pageSize: number;
  comments: CommentRecord[];
};

type CommentsClientProps = {
  postId: string;
  initialComments: CommentRecord[];
  pageSize: number;
};

type CommentUpdateApiResult =
  | {
      ok: true;
      comment: {
        commentId: string;
        content: string;
        updatedAt: string;
      };
    }
  | {
      ok: false;
      code?: string;
      message?: string;
    };

const formatDateTime = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("ko-KR", { hour12: false });
};

export function CommentsClient({ postId, initialComments, pageSize }: CommentsClientProps) {
  const [comments, setComments] = useState<CommentRecord[]>(initialComments);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyValidationMessage, setReplyValidationMessage] = useState("");
  const [replySubmittingParentId, setReplySubmittingParentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editValidationMessage, setEditValidationMessage] = useState("");
  const [updatingCommentId, setUpdatingCommentId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const canLoadMore = useMemo(
    () => !isLoadingMore && comments.length > 0 && comments.length % pageSize === 0,
    [comments.length, isLoadingMore, pageSize],
  );

  const commentIdSet = useMemo(() => new Set(comments.map((comment) => comment.id)), [comments]);

  const topLevelComments = useMemo(
    () =>
      comments.filter(
        (comment) =>
          !comment.parentId ||
          (typeof comment.parentId === "string" && !commentIdSet.has(comment.parentId)),
      ),
    [comments, commentIdSet],
  );

  const repliesByParent = useMemo(() => {
    const grouped = new Map<string, CommentRecord[]>();
    for (const comment of comments) {
      if (!comment.parentId) {
        continue;
      }

      const found = grouped.get(comment.parentId);
      if (found) {
        found.push(comment);
        continue;
      }

      grouped.set(comment.parentId, [comment]);
    }

    return grouped;
  }, [comments]);

  const loadNextPage = async () => {
    const nextPage = page + 1;
    if (nextPage < 2 || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setMessage("");

    try {
      const response = await fetch(`/api/posts/${postId}/comments?page=${nextPage}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = (await response.json()) as CommentListResponse;

      if (!response.ok || !data.ok) {
        setMessage("댓글을 더 불러오지 못했습니다.");
        return;
      }

      setComments((prev) => [...prev, ...data.comments]);
      setPage(data.page);
    } catch {
      setMessage("댓글 추가 로딩 실패");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const validateContent = (value: string): string | null => {
    if (value.length < 1 || value.length > 500) {
      return "댓글은 1자 이상 500자 이하로 입력해주세요.";
    }

    if (value.trim().length < 1) {
      return "공백만 입력할 수 없습니다.";
    }

    return null;
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const nextValidation = validateContent(content);
    if (nextValidation) {
      setValidationMessage(nextValidation);
      return;
    }

    setIsSubmitting(true);
    setValidationMessage("");
    setMessage("");

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          postId,
          content,
        }),
      });

      const data = (await response.json()) as
        | { ok: true; comment: CommentRecord }
        | { ok: false; code?: string; message?: string };

      if (!response.ok || !data.ok) {
        const serverMessage = "message" in data ? data.message : undefined;
        if (response.status === 401) {
          setValidationMessage("로그인 후 댓글을 작성할 수 있습니다.");
        } else {
          setValidationMessage(serverMessage ?? "댓글 등록에 실패했습니다.");
        }
        return;
      }

      setComments((prev) => [...prev, data.comment]);
      setContent("");
    } catch {
      setValidationMessage("댓글 등록 요청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (deletingCommentId) {
      return;
    }

    const shouldDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!shouldDelete) {
      return;
    }

    setDeletingCommentId(commentId);
    setMessage("");
    const result = await requestCommentDelete(commentId);

    if (!result.ok) {
      if (result.code === "unauthorized") {
        setMessage("로그인 후 삭제할 수 있습니다.");
      } else if (result.code === "forbidden") {
        setMessage("삭제 권한이 없습니다.");
      } else if (result.code === "not_found") {
        setMessage("이미 삭제되었거나 존재하지 않는 댓글입니다.");
      } else if (result.code === "invalid_id") {
        setMessage("삭제할 댓글 ID가 유효하지 않습니다.");
      } else {
        setMessage("댓글 삭제에 실패했습니다.");
      }
      setDeletingCommentId(null);
      return;
    }

    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    setDeletingCommentId(null);
  };

  const startEdit = (comment: CommentRecord) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
    setEditValidationMessage("");
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
    setEditValidationMessage("");
  };

  const saveEdit = async (commentId: string) => {
    if (updatingCommentId) {
      return;
    }

    const nextValidation = validateContent(editingContent);
    if (nextValidation) {
      setEditValidationMessage(nextValidation);
      return;
    }

    setUpdatingCommentId(commentId);
    setEditValidationMessage("");
    setMessage("");

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: editingContent }),
      });
      const data = (await response.json()) as CommentUpdateApiResult;

      if (!response.ok || !data.ok) {
        const errorCode = data.ok ? undefined : data.code;
        const errorMessage = data.ok ? undefined : data.message;
        if (response.status === 403 || errorCode === "forbidden") {
          setEditValidationMessage("수정 권한이 없습니다.");
        } else if (response.status === 404 || errorCode === "not_found") {
          setEditValidationMessage("댓글을 찾을 수 없습니다.");
        } else {
          setEditValidationMessage(errorMessage ?? "댓글 수정에 실패했습니다.");
        }
        return;
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                content: data.comment.content,
                updatedAt: data.comment.updatedAt,
              }
            : comment,
        ),
      );
      cancelEdit();
    } catch {
      setEditValidationMessage("댓글 수정 요청에 실패했습니다.");
    } finally {
      setUpdatingCommentId(null);
    }
  };

  const toggleReplyForm = (commentId: string) => {
    if (replyParentId === commentId) {
      setReplyParentId(null);
      setReplyContent("");
      setReplyValidationMessage("");
      return;
    }

    setReplyParentId(commentId);
    setReplyContent("");
    setReplyValidationMessage("");
  };

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>, parentId: string) => {
    event.preventDefault();
    if (replySubmittingParentId) {
      return;
    }

    const nextValidation = validateContent(replyContent);
    if (nextValidation) {
      setReplyValidationMessage(nextValidation);
      return;
    }

    setReplySubmittingParentId(parentId);
    setReplyValidationMessage("");
    setMessage("");

    try {
      const response = await fetch(`/api/comments/${parentId}/replies`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          postId,
          content: replyContent,
        }),
      });

      const data = (await response.json()) as
        | { ok: true; comment: CommentRecord }
        | { ok: false; code?: string; message?: string };

      if (!response.ok || !data.ok) {
        const errorMessage = data.ok ? undefined : data.message;
        if (response.status === 401) {
          setReplyValidationMessage("로그인 후 답글을 작성할 수 있습니다.");
        } else if (response.status === 404) {
          setReplyValidationMessage("원본 댓글을 찾을 수 없습니다.");
        } else {
          setReplyValidationMessage(errorMessage ?? "답글 등록에 실패했습니다.");
        }
        return;
      }

      setComments((prev) => [...prev, data.comment]);
      setReplyContent("");
      setReplyParentId(null);
    } catch {
      setReplyValidationMessage("답글 등록 요청에 실패했습니다.");
    } finally {
      setReplySubmittingParentId(null);
    }
  };

  return (
    <section className="post-comments">
      <h2>댓글</h2>
      <form className="post-comments__create" onSubmit={(event) => void handleCreate(event)}>
        <textarea
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={500}
          placeholder="댓글을 입력하세요"
          rows={4}
          disabled={isSubmitting}
        />
        <div className="post-comments__create-meta">
          <span>{content.length}/500</span>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </div>
        {validationMessage ? <p>{validationMessage}</p> : null}
      </form>
      {comments.length === 0 ? (
        <p>등록된 댓글이 없습니다.</p>
      ) : (
        <ul className="post-comments__list">
          {topLevelComments.map((comment) => {
            const replies = repliesByParent.get(comment.id) ?? [];
            const isReplyFormOpen = replyParentId === comment.id;

            return (
            <li key={comment.id} className="post-comments__item">
              <div className="post-comments__meta">
                <strong>{comment.authorName}</strong>
                <span>@{comment.authorLoginId}</span>
                <time dateTime={comment.createdAt}>{formatDateTime(comment.createdAt)}</time>
              </div>
              {editingCommentId === comment.id ? (
                <div className="post-comments__edit">
                  <textarea
                    name={`edit-${comment.id}`}
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                    maxLength={500}
                    rows={4}
                    disabled={updatingCommentId !== null}
                  />
                  <div className="post-comments__edit-meta">
                    <span>{editingContent.length}/500</span>
                    <div className="post-comments__edit-actions">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={updatingCommentId !== null}
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => void saveEdit(comment.id)}
                        disabled={updatingCommentId !== null}
                      >
                        {updatingCommentId === comment.id ? "저장 중..." : "저장"}
                      </button>
                    </div>
                  </div>
                  {editValidationMessage ? <p>{editValidationMessage}</p> : null}
                </div>
              ) : (
                <p>{comment.content}</p>
              )}
              <div className="post-comments__controls">
                {!comment.isDeleted ? (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(comment)}
                      disabled={updatingCommentId !== null || editingCommentId === comment.id}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleReplyForm(comment.id)}
                      disabled={replySubmittingParentId !== null || editingCommentId === comment.id}
                    >
                      {isReplyFormOpen ? "닫기" : "답글"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(comment.id)}
                      disabled={deletingCommentId !== null || editingCommentId === comment.id}
                    >
                      {deletingCommentId === comment.id ? "삭제 중..." : "삭제"}
                    </button>
                  </>
                ) : null}
              </div>

              {isReplyFormOpen ? (
                <form
                  className="post-comments__reply-form"
                  onSubmit={(event) => void handleReplySubmit(event, comment.id)}
                >
                  <textarea
                    name={`reply-${comment.id}`}
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                    maxLength={500}
                    placeholder="답글을 입력하세요"
                    rows={3}
                    disabled={replySubmittingParentId !== null}
                  />
                  <div className="post-comments__reply-meta">
                    <span>{replyContent.length}/500</span>
                    <button type="submit" disabled={replySubmittingParentId !== null}>
                      {replySubmittingParentId === comment.id ? "등록 중..." : "등록"}
                    </button>
                  </div>
                  {replyValidationMessage ? <p>{replyValidationMessage}</p> : null}
                </form>
              ) : null}

              {replies.length > 0 ? (
                <ul className="post-comments__replies">
                  {replies.map((reply) => (
                    <li key={reply.id} className="post-comments__reply-item">
                      <div className="post-comments__meta">
                        <strong>{reply.authorName}</strong>
                        <span>@{reply.authorLoginId}</span>
                        <time dateTime={reply.createdAt}>{formatDateTime(reply.createdAt)}</time>
                      </div>
                      <p>{reply.content}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
            );
          })}
        </ul>
      )}

      <div className="post-comments__actions">
        <button type="button" onClick={() => void loadNextPage()} disabled={!canLoadMore}>
          {isLoadingMore ? "불러오는 중..." : "댓글 더보기"}
        </button>
        {message ? <p>{message}</p> : null}
      </div>
    </section>
  );
}
