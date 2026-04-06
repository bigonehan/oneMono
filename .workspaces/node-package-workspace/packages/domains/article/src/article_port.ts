import type { Article, NewArticle } from "./models/article.js";

export interface ArticlePort {
  createArticle(input: NewArticle): Promise<Article>;
  getArticleById(articleId: string): Promise<Article | null>;
  listArticles(): Promise<Article[]>;
  updateArticle(articleId: string, input: Partial<NewArticle>): Promise<Article | null>;
  deleteArticle(articleId: string): Promise<boolean>;
}
