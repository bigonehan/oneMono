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

const formatDateTime = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString("ko-KR", { hour12: false });
};

export default function PostPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingEditor, startLoadingEditor] = useTransition();

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
                    setExpandedId((prev) => (prev === post.id ? null : post.id));
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
                  </div>
                  {isExpanded ? (
                    <article className="post-list__body" dangerouslySetInnerHTML={{ __html: post.body }} />
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
