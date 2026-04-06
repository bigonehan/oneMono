"use client";

type ArticleCardItem = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  modified_at: string;
  rule: string;
};

type ListArticleProps = {
  articles: ArticleCardItem[];
};

export const ListArticle = ({ articles }: ListArticleProps) => (
  <section className="grid gap-4">
    {articles.map((article) => (
      <article key={article.id} className="rounded-lg border p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">{article.title}</h3>
          <span className="rounded-full border px-2 py-1 text-xs">{article.rule}</span>
        </div>
        <p className="line-clamp-3 text-sm text-neutral-700">{article.body}</p>
        <div className="mt-3 text-xs text-neutral-500">
          <p>created: {article.created_at}</p>
          <p>modified: {article.modified_at}</p>
        </div>
      </article>
    ))}
  </section>
);
