export type ArticleCreateInput = {
  title: string;
  date: string;
  tags: string[];
  category: string;
  description?: string;
  content: string;
  series?: string;
  seriesOrder?: number;
};

export type ArticleDocument = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  description: string;
  content: string;
  draft: boolean;
  series?: string;
  seriesOrder?: number;
  path: string;
};

export interface IArticleCreateUseCase {
  create(input: ArticleCreateInput): Promise<ArticleDocument>;
}

export interface IArticleReadUseCase {
  list(): Promise<ArticleDocument[]>;
  get(slug: string): Promise<ArticleDocument | null>;
  getDetail(slug: string): Promise<{
    post: ArticleDocument;
    prev?: ArticleDocument;
    next?: ArticleDocument;
  } | null>;
  search(
    query: string,
  ): Promise<
    Array<{
      slug: string;
      title: string;
      description: string;
      tags: string[];
      content: string;
      score: number;
    }>
  >;
  getSearchIndex(): Promise<
    Array<{
      slug: string;
      title: string;
      description: string;
      tags: string[];
      content: string;
    }>
  >;
}

export interface IArticleUpdateUseCase {
  update(slug: string, input: Partial<ArticleCreateInput>): Promise<ArticleDocument>;
}

export interface IArticleDeleteUseCase {
  remove(slug: string): Promise<void>;
}

export interface IArticleLikeUseCase {
  toggle(articleSlug: string, userEmail: string): Promise<{ liked: boolean; count: number }>;
  count(articleSlug: string): Promise<number>;
}

export interface IArticleBookmarkUseCase {
  toggle(articleSlug: string, userEmail: string): Promise<{ bookmarked: boolean }>;
  listByUser(userEmail: string): Promise<Array<{ articleSlug: string; savedAt: string }>>;
}

export interface IArticleViewUseCase {
  record(input: { articleSlug: string; ip: string; userAgent: string; now?: Date }): Promise<{ count: number; counted: boolean }>;
}
