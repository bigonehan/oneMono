import { randomUUID } from "node:crypto";
import type { ArticleAuthor, ArticlePort, ArticleWithAuthor, NewArticle } from "@domain/article";
import type { ArticleFileSchema, ArticleMarkdownStore } from "@infras/article-md";

const toArticleWithAuthor = (schema: ArticleFileSchema): ArticleWithAuthor => ({
  article: schema.article,
  authorLoginId: schema.authorLoginId,
  authorName: schema.authorName,
});

export class MarkdownArticleAdapter implements ArticlePort {
  constructor(private readonly store: ArticleMarkdownStore) {}

  async createArticleByAuthor(
    input: NewArticle,
    author: ArticleAuthor,
  ): Promise<ArticleWithAuthor> {
    const now = new Date().toISOString();
    const schema: ArticleFileSchema = {
      article: {
        id: randomUUID(),
        title: input.title,
        body: input.body,
        rule: input.rule,
        created_at: now,
        modified_at: now,
      },
      authorLoginId: author.loginId,
      authorName: author.name,
    };

    await this.store.save(schema);
    return toArticleWithAuthor(schema);
  }

  async getArticleWithAuthorById(articleId: string): Promise<ArticleWithAuthor | null> {
    const found = await this.store.get(articleId);
    return found ? toArticleWithAuthor(found) : null;
  }

  async listArticlesWithAuthor(): Promise<ArticleWithAuthor[]> {
    const rows = await this.store.list();
    return rows.map(toArticleWithAuthor);
  }

  async updateArticleByAuthor(
    articleId: string,
    input: Partial<NewArticle>,
    authorLoginId: string,
  ): Promise<ArticleWithAuthor | null> {
    const found = await this.store.get(articleId);
    if (!found || found.authorLoginId !== authorLoginId) {
      return null;
    }

    const schema: ArticleFileSchema = {
      ...found,
      article: {
        ...found.article,
        ...input,
        modified_at: new Date().toISOString(),
      },
    };

    await this.store.save(schema);
    return toArticleWithAuthor(schema);
  }

  async deleteArticleByAuthor(articleId: string, authorLoginId: string): Promise<boolean> {
    const found = await this.store.get(articleId);
    if (!found || found.authorLoginId !== authorLoginId) {
      return false;
    }

    return this.store.delete(articleId);
  }
}
