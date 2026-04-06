import {
  createArticleModel,
  type Article,
  type ArticlePort,
  type NewArticle,
} from "@domain/article";

export type ArticleAuthor = {
  loginId: string;
  name: string;
};

export type ArticleWithAuthor = {
  article: Article;
  authorLoginId: string;
  authorName: string;
};

export type ArticleMarkdownStore = {
  get(articleId: string): Promise<ArticleWithAuthor | null>;
  list(): Promise<ArticleWithAuthor[]>;
  save(schema: ArticleWithAuthor): Promise<void>;
  delete(articleId: string): Promise<boolean>;
};

const createArticleId = (): string => {
  const random = Math.random().toString(36).slice(2, 10);
  return `art_${Date.now()}_${random}`;
};

export class MarkdownArticleAdapter implements ArticlePort {
  private readonly store: ArticleMarkdownStore;

  constructor(store: ArticleMarkdownStore) {
    this.store = store;
  }

  async createArticle(input: NewArticle): Promise<Article> {
    const created = await this.createArticleByAuthor(input, {
      loginId: "anonymous",
      name: "anonymous",
    });

    return created.article;
  }

  async createArticleByAuthor(
    input: NewArticle,
    author: ArticleAuthor,
  ): Promise<ArticleWithAuthor> {
    const article = createArticleModel(input, createArticleId());
    const schema: ArticleWithAuthor = {
      article,
      authorLoginId: author.loginId,
      authorName: author.name,
    };

    await this.store.save(schema);
    return schema;
  }

  async getArticleById(articleId: string): Promise<Article | null> {
    const found = await this.store.get(articleId);
    return found?.article ?? null;
  }

  async getArticleWithAuthorById(articleId: string): Promise<ArticleWithAuthor | null> {
    return this.store.get(articleId);
  }

  async listArticles(): Promise<Article[]> {
    const rows = await this.store.list();
    return rows.map((row) => row.article);
  }

  async listArticlesWithAuthor(): Promise<ArticleWithAuthor[]> {
    return this.store.list();
  }

  async updateArticle(articleId: string, input: Partial<NewArticle>): Promise<Article | null> {
    const updated = await this.updateArticleByAuthor(articleId, input);
    return updated?.article ?? null;
  }

  async updateArticleByAuthor(
    articleId: string,
    input: Partial<NewArticle>,
    authorLoginId?: string,
  ): Promise<ArticleWithAuthor | null> {
    const found = await this.store.get(articleId);
    if (!found) {
      return null;
    }

    if (authorLoginId && found.authorLoginId !== authorLoginId) {
      return null;
    }

    const next: ArticleWithAuthor = {
      ...found,
      article: {
        ...found.article,
        ...input,
        modified_at: new Date().toISOString(),
      },
    };

    await this.store.save(next);
    return next;
  }

  async deleteArticle(articleId: string): Promise<boolean> {
    return this.store.delete(articleId);
  }

  async deleteArticleByAuthor(articleId: string, authorLoginId: string): Promise<boolean> {
    const found = await this.store.get(articleId);
    if (!found || found.authorLoginId !== authorLoginId) {
      return false;
    }

    return this.store.delete(articleId);
  }
}
