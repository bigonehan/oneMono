import {
  createArticleModel,
  type Article,
  type ArticlePort,
  type NewArticle,
} from "@domain/article";
import { createUserModel, type NewUser, type User, type UserPort } from "@domain/user";
import { createGelClient, generateGelId, type GelClient } from "@infras/gel-client";

export type UserArticleRow = {
  userId: string;
  userName: string;
  articleTitle: string;
  articleRule: "public" | "private" | "protected";
};

export class GelUserArticleAdapter implements UserPort, ArticlePort {
  private readonly client: GelClient;

  constructor(client: GelClient = createGelClient()) {
    this.client = client;
  }

  async createUser(input: NewUser): Promise<User> {
    const user = createUserModel(input, generateGelId("usr"));
    this.client.users.insert(user);
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.client.users.get(userId);
  }

  async listUsers(): Promise<User[]> {
    return this.client.users.list();
  }

  async updateUser(userId: string, input: Partial<NewUser>): Promise<User | null> {
    return this.client.users.update(userId, {
      ...input,
      modified_at: new Date().toISOString(),
    });
  }

  async deleteUser(userId: string): Promise<boolean> {
    return this.client.users.delete(userId);
  }

  async createArticle(input: NewArticle): Promise<Article> {
    const article = createArticleModel(input, generateGelId("art"));
    this.client.articles.insert(article);
    return article;
  }

  async getArticleById(articleId: string): Promise<Article | null> {
    return this.client.articles.get(articleId);
  }

  async listArticles(): Promise<Article[]> {
    return this.client.articles.list();
  }

  async updateArticle(
    articleId: string,
    input: Partial<NewArticle>,
  ): Promise<Article | null> {
    return this.client.articles.update(articleId, {
      ...input,
      modified_at: new Date().toISOString(),
    });
  }

  async deleteArticle(articleId: string): Promise<boolean> {
    return this.client.articles.delete(articleId);
  }

  async listUserArticleRows(userId: string): Promise<UserArticleRow[]> {
    const user = await this.getUserById(userId);
    if (!user) {
      return [];
    }

    return this.client.articles.list().map((article) => ({
      userId: user.id,
      userName: user.name,
      articleTitle: article.title,
      articleRule: article.rule,
    }));
  }
}
