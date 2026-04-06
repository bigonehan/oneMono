"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListCard } from "@ui/shadcn";
import { useEffect, useMemo, useState, useTransition } from "react";

type AuthUser = {
  userId: string;
  loginId: string;
  name: string;
};

type PostItem = {
  id: string;
  title: string;
  body: string;
  rule: "public" | "private" | "protected";
  created_at: string;
  modified_at: string;
  authorLoginId: string;
  authorName: string;
  thumbnail?: string;
};

type AuthResponse = {
  ok: boolean;
  user: AuthUser | null;
};

type PostListResponse = {
  ok: boolean;
  posts: PostItem[];
};

type CommentItem = {
  id: string;
  postId: string;
  author: {
    userId: string;
    loginId: string;
    name: string;
  };
  content: string;
  createdAt: string;
};

type CommentListResponse = {
  ok: boolean;
  comments: CommentItem[];
};

type CommentCreateResponse = {
  ok: boolean;
  message?: string;
  comment?: CommentItem;
};

const formatDateTime = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString("ko-KR", { hour12: false });
};

const validateCommentContent = (content: string): string | null => {
  if (content.length < 1 || content.length > 500) {
    return "댓글은 1자 이상 500자 이하로 입력해야 합니다.";
  }

  if (content.trim().length < 1) {
    return "공백만으로는 댓글을 등록할 수 없습니다.";
  }

  return null;
};

export default function PostPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingEditor, startLoadingEditor] = useTransition();
  const [commentsByPostId, setCommentsByPostId] = useState<Record<string, CommentItem[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentStatusByPostId, setCommentStatusByPostId] = useState<Record<string, string>>({});
  const [commentSubmittingByPostId, setCommentSubmittingByPostId] = useState<Record<string, boolean>>({});

  const canWrite = useMemo(() => authUser !== null, [authUser]);

  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch("/api/post", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const data = (await response.json()) as PostListResponse;
      if (!response.ok || !data.ok) {
        setMessage("게시글을 불러오지 못했습니다.");
        setPosts([]);
        return;
      }

      setPosts(data.posts);
      setMessage("");
    } catch {
      setMessage("게시글 조회 요청 실패");
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const data = (await response.json()) as AuthResponse;
        setAuthUser(data.user);
      } catch {
        setAuthUser(null);
      }
    };

    void Promise.all([loadSession(), loadPosts()]);
  }, []);

  const loadComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const data = (await response.json()) as CommentListResponse;
      if (!response.ok || !data.ok) {
        setCommentStatusByPostId((prev) => ({
          ...prev,
          [postId]: "댓글 목록을 불러오지 못했습니다.",
        }));
        return;
      }

      setCommentsByPostId((prev) => ({ ...prev, [postId]: data.comments }));
      setCommentStatusByPostId((prev) => ({ ...prev, [postId]: "" }));
    } catch {
      setCommentStatusByPostId((prev) => ({
        ...prev,
        [postId]: "댓글 조회 요청 실패",
      }));
    }
  };

  const submitComment = async (postId: string) => {
    const content = commentInputs[postId] ?? "";
    const invalidReason = validateCommentContent(content);
    if (invalidReason) {
      setCommentStatusByPostId((prev) => ({ ...prev, [postId]: invalidReason }));
      return;
    }

    setCommentSubmittingByPostId((prev) => ({ ...prev, [postId]: true }));
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });

      const data = (await response.json()) as CommentCreateResponse;
      if (!response.ok || !data.ok) {
        setCommentStatusByPostId((prev) => ({
          ...prev,
          [postId]: data.message ?? "댓글 등록 실패",
        }));
        return;
      }

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setCommentStatusByPostId((prev) => ({ ...prev, [postId]: "댓글이 등록되었습니다." }));
      await loadComments(postId);
    } catch {
      setCommentStatusByPostId((prev) => ({
        ...prev,
        [postId]: "댓글 등록 요청 실패",
      }));
    } finally {
      setCommentSubmittingByPostId((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const deletePost = async (postId: string) => {
    const confirmed = window.confirm("이 글을 삭제하시겠습니까?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        setMessage("삭제 권한이 없거나 글이 없습니다.");
        return;
      }

      setMessage("삭제 완료");
      await loadPosts();
    } catch {
      setMessage("삭제 요청 실패");
    }
  };

  return (
    <main className="post-page">
      <header className="post-page__header">
        <h1>Post</h1>
        <p>날짜, 작성자, 제목을 확인하고 제목을 눌러 본문을 펼치세요.</p>
        <div className="post-page__actions">
          <Link href="/">Home</Link>
          <button
            type="button"
            disabled={!canWrite || isLoadingEditor}
            onClick={() => {
              if (!canWrite) {
                setMessage("로그인 후 글쓰기가 가능합니다.");
                return;
              }
              startLoadingEditor(() => {
                router.push("/post/editor");
              });
            }}
          >
            글쓰기
          </button>
        </div>
      </header>

      {isLoadingEditor ? (
        <div className="post-waiting" role="status" aria-live="polite">
          <div className="post-waiting__dialog">대기중... 에디터를 여는 중입니다.</div>
        </div>
      ) : null}

      {message ? <p className="post-page__message">{message}</p> : null}

      {isLoadingPosts ? (
        <p>게시글 로딩 중...</p>
      ) : posts.length === 0 ? (
        <p>등록된 글이 없습니다.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => {
            const isExpanded = expandedId === post.id;
            const isOwner = authUser?.loginId === post.authorLoginId;

            return (
              <li key={post.id} className="post-list__item">
                <ListCard
                  title={post.title}
                  author={`${post.authorName} (${post.authorLoginId})`}
                  thumbnailUrl={post.thumbnail}
                  onTitleClick={() => {
                    setExpandedId((prev) => {
                      if (prev === post.id) {
                        return null;
                      }
                      void loadComments(post.id);
                      return post.id;
                    });
                  }}
                  actions={
                    isOwner ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            startLoadingEditor(() => {
                              router.push(`/post/editor?id=${post.id}`);
                            });
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => {
                            void deletePost(post.id);
                          }}
                        >
                          삭제
                        </button>
                      </>
                    ) : null
                  }
                >
                  <div className="post-list__meta">
                    <span>{formatDateTime(post.created_at)}</span>
                    <Link href={`/post/${post.id}`}>댓글 보기</Link>
                  </div>
                  {isExpanded ? (
                    <>
                      <article className="post-list__body" dangerouslySetInnerHTML={{ __html: post.body }} />
                      <section className="comment-box">
                        <h3>댓글</h3>
                        <textarea
                          value={commentInputs[post.id] ?? ""}
                          placeholder="댓글을 입력하세요 (1~500자)"
                          maxLength={500}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setCommentInputs((prev) => ({ ...prev, [post.id]: nextValue }));
                            setCommentStatusByPostId((prev) => ({ ...prev, [post.id]: "" }));
                          }}
                        />
                        <div className="comment-box__actions">
                          <button
                            type="button"
                            disabled={!canWrite || commentSubmittingByPostId[post.id] === true}
                            onClick={() => {
                              if (!canWrite) {
                                setCommentStatusByPostId((prev) => ({
                                  ...prev,
                                  [post.id]: "로그인 후 댓글을 작성할 수 있습니다.",
                                }));
                                return;
                              }
                              void submitComment(post.id);
                            }}
                          >
                            등록
                          </button>
                        </div>
                        {commentStatusByPostId[post.id] ? (
                          <p className="comment-box__status">{commentStatusByPostId[post.id]}</p>
                        ) : null}
                        {commentsByPostId[post.id]?.length ? (
                          <ul className="comment-list">
                            {commentsByPostId[post.id].map((comment) => (
                              <li key={comment.id}>
                                <div className="comment-list__meta">
                                  <strong>{comment.author.name}</strong>
                                  <span>{comment.author.loginId}</span>
                                  <time>{formatDateTime(comment.createdAt)}</time>
                                </div>
                                <p>{comment.content}</p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="comment-box__empty">첫 댓글을 남겨보세요.</p>
                        )}
                      </section>
                    </>
                  ) : null}
                </ListCard>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
