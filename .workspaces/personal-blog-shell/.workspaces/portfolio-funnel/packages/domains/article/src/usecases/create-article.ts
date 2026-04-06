import type { Article, NewArticle } from "../models/article.js";

export const createArticleModel = (input: NewArticle, id: string): Article => {
  const now = new Date().toISOString();

  return {
    id,
    title: input.title,
    body: input.body,
    rule: input.rule,
    created_at: now,
    modified_at: now,
  };
};
