import type { Article, ArticleAuthor, NewArticle } from "./article_entity.js";

export type ArticleWithAuthor = {
  article: Article;
  authorLoginId: string;
  authorName: string;
};

export interface ArticlePort {
  createArticleByAuthor(input: NewArticle, author: ArticleAuthor): Promise<ArticleWithAuthor>;
  getArticleWithAuthorById(articleId: string): Promise<ArticleWithAuthor | null>;
  listArticlesWithAuthor(): Promise<ArticleWithAuthor[]>;
  updateArticleByAuthor(
    articleId: string,
    input: Partial<NewArticle>,
    authorLoginId: string,
  ): Promise<ArticleWithAuthor | null>;
  deleteArticleByAuthor(articleId: string, authorLoginId: string): Promise<boolean>;
}
