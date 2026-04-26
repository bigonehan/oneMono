import Link from "next/link";
import { notFound } from "next/navigation";
import { runCommentReadSteps } from "../../actions/commentread.steps";
import { CommentsClient } from "./comments-client";
import { postAdapter } from "../../../lib/post-adapter";

type Params = {
  postId: string;
};

export const revalidate = 60;

const formatDateTime = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("ko-KR", { hour12: false });
};

export default async function PostDetailPage({ params }: { params: Promise<Params> }) {
  const { postId } = await params;
  const found = await postAdapter.getArticleWithAuthorById(postId);

  if (!found) {
    notFound();
  }

  const initialCommentResult = await runCommentReadSteps({ postId, page: 1 }, { mode: "initial" });
  const initialComments = initialCommentResult.ok ? initialCommentResult.comments : [];
  const pageSize = initialCommentResult.ok ? initialCommentResult.pageSize : 20;

  return (
    <main className="post-detail-page">
      <header className="post-detail-page__header">
        <h1>{found.article.title}</h1>
        <p>
          {found.authorName} ({found.authorLoginId})
        </p>
        <time dateTime={found.article.created_at}>{formatDateTime(found.article.created_at)}</time>
        <Link href="/post">목록으로</Link>
      </header>

      <article className="post-detail-page__body" dangerouslySetInnerHTML={{ __html: found.article.body }} />

      <CommentsClient postId={postId} initialComments={initialComments} pageSize={pageSize} />
    </main>
  );
}
