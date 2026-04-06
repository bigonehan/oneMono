export type ArticleRule = "public" | "private" | "protected";

export type Article = {
  id: string;
  title: string;
  body: string;
  rule: ArticleRule;
  created_at: string;
  modified_at: string;
};

export type NewArticle = {
  title: string;
  body: string;
  rule: ArticleRule;
};
