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
}

export interface IArticleUpdateUseCase {
  update(slug: string, input: Partial<ArticleCreateInput>): Promise<ArticleDocument>;
}

export interface IArticleDeleteUseCase {
  remove(slug: string): Promise<void>;
}
