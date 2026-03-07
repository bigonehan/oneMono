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
  update(input: {
    commentId: string;
    content: string;
    requesterEmail: string;
    requesterRole: "admin" | "user";
  }): Promise<CommentRecord>;
}

export interface ICommentDeleteUseCase {
  remove(input: {
    commentId: string;
    requesterEmail: string;
    requesterRole: "admin" | "user";
  }): Promise<CommentRecord>;
}

export type NotificationRecord = {
  id: string;
  userEmail: string;
  actorEmail: string;
  articleSlug: string;
  commentId: string;
  type: "article_comment" | "comment_reply";
  read: boolean;
  createdAt: string;
};

export interface INotificationUseCase {
  notify(input: {
    userEmail: string;
    actorEmail: string;
    articleSlug: string;
    commentId: string;
    type: "article_comment" | "comment_reply";
  }): Promise<NotificationRecord | null>;
  list(userEmail: string, read?: boolean): Promise<NotificationRecord[]>;
  markRead(userEmail: string, notificationId: string): Promise<NotificationRecord>;
}
