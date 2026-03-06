export type CommentRecord = {
  id: string;
  articleSlug: string;
  authorEmail: string;
  content: string;
  parentId?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface ICommentCreateUseCase {
  create(input: Omit<CommentRecord, "id" | "deleted" | "createdAt" | "updatedAt">): Promise<CommentRecord>;
}

export interface ICommentReadUseCase {
  listByArticle(articleSlug: string): Promise<CommentRecord[]>;
}

export interface ICommentUpdateUseCase {
  update(commentId: string, content: string): Promise<CommentRecord>;
}

export interface ICommentDeleteUseCase {
  remove(commentId: string): Promise<CommentRecord>;
}
