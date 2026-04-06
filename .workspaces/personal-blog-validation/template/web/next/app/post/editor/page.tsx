"use client";

import { ArticleEditor } from "@features/editor";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type AuthUser = {
  userId: string;
  loginId: string;
  name: string;
};

type AuthResponse = {
  ok: boolean;
  user: AuthUser | null;
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
};

type PostResponse = {
  ok: boolean;
  message?: string;
  post?: PostItem;
};

export default function PostEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingPostId = searchParams.get("id");

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rule, setRule] = useState<PostItem["rule"]>("public");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const modeLabel = useMemo(() => (editingPostId ? "수정" : "등록"), [editingPostId]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      try {
        const authResponse = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const authData = (await authResponse.json()) as AuthResponse;
        if (!authData.user) {
          setStatusMessage("로그인 후 글쓰기를 사용할 수 있습니다.");
          setAuthUser(null);
          setIsLoading(false);
          return;
        }

        setAuthUser(authData.user);

        if (!editingPostId) {
          setIsLoading(false);
          return;
        }

        const postResponse = await fetch(`/api/post/${editingPostId}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const postData = (await postResponse.json()) as PostResponse;

        if (!postResponse.ok || !postData.ok || !postData.post) {
          setStatusMessage("수정할 게시글을 찾을 수 없습니다.");
          setIsLoading(false);
          return;
        }

        if (postData.post.authorLoginId !== authData.user.loginId) {
          setStatusMessage("본인 글만 수정할 수 있습니다.");
          setIsLoading(false);
          return;
        }

        setTitle(postData.post.title);
        setBody(postData.post.body);
        setRule(postData.post.rule);
      } catch {
        setStatusMessage("에디터 초기화 실패");
      } finally {
        setIsLoading(false);
      }
    };

    void initialize();
  }, [editingPostId]);

  const submit = async () => {
    if (!authUser) {
      setStatusMessage("로그인이 필요합니다.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      setStatusMessage("제목과 본문을 입력하세요.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(`${modeLabel} 중...`);

    try {
      const response = await fetch(editingPostId ? `/api/post/${editingPostId}` : "/api/post", {
        method: editingPostId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: trimmedTitle,
          body: trimmedBody,
          rule,
        }),
      });

      const data = (await response.json()) as PostResponse;
      if (!response.ok || !data.ok) {
        setStatusMessage(data.message ?? `${modeLabel} 실패`);
        return;
      }

      setStatusMessage(`${modeLabel} 완료`);
      router.push("/post");
    } catch {
      setStatusMessage(`${modeLabel} 요청 실패`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="post-editor-page">
      <header className="post-editor-page__header">
        <h1>Post Editor</h1>
        <p>{editingPostId ? "글 수정" : "새 글 작성"}</p>
        <Link href="/post">목록으로</Link>
      </header>

      {isLoading ? (
        <p>에디터 로딩 중...</p>
      ) : !authUser ? (
        <p>{statusMessage || "로그인이 필요합니다."}</p>
      ) : (
        <section className="post-editor-form">
          <label>
            제목
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력하세요"
            />
          </label>

          <label>
            공개 범위
            <select
              value={rule}
              onChange={(event) => setRule(event.target.value as PostItem["rule"])}
            >
              <option value="public">public</option>
              <option value="private">private</option>
              <option value="protected">protected</option>
            </select>
          </label>

          <div className="post-editor-form__editor">
            <ArticleEditor value={body} onChange={setBody} placeholder="내용을 입력하세요" />
          </div>

          <button type="button" onClick={() => void submit()} disabled={isSubmitting}>
            {isSubmitting ? `${modeLabel} 중...` : `${modeLabel}`}
          </button>
        </section>
      )}

      {statusMessage ? <p className="post-editor-page__status">{statusMessage}</p> : null}
    </main>
  );
}
