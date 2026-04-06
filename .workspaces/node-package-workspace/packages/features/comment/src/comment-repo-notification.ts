import type { INotificationUseCase, NotificationRecord } from "./comment-usecase";

const notificationStore = new Map<string, NotificationRecord[]>();

export class CommentNotificationMemoryRepo implements INotificationUseCase {
  async notify(input: {
    userEmail: string;
    actorEmail: string;
    articleSlug: string;
    commentId: string;
    type: "article_comment" | "comment_reply";
  }): Promise<NotificationRecord | null> {
    if (input.userEmail === input.actorEmail) {
      return null;
    }

    const now = new Date().toISOString();
    const row: NotificationRecord = {
      id: crypto.randomUUID(),
      userEmail: input.userEmail,
      actorEmail: input.actorEmail,
      articleSlug: input.articleSlug,
      commentId: input.commentId,
      type: input.type,
      read: false,
      createdAt: now,
    };

    const existing = notificationStore.get(input.userEmail) ?? [];
    const next = [row, ...existing].slice(0, 100);
    notificationStore.set(input.userEmail, next);
    return row;
  }

  async list(userEmail: string, read?: boolean): Promise<NotificationRecord[]> {
    const list = notificationStore.get(userEmail) ?? [];
    if (typeof read !== "boolean") {
      return list;
    }
    return list.filter((item) => item.read === read);
  }

  async markRead(userEmail: string, notificationId: string): Promise<NotificationRecord> {
    const list = notificationStore.get(userEmail) ?? [];
    const index = list.findIndex((item) => item.id === notificationId);
    if (index < 0) {
      throw new Error("notification not found");
    }

    const nextItem: NotificationRecord = { ...list[index], read: true };
    const next = [...list];
    next[index] = nextItem;
    notificationStore.set(userEmail, next);
    return nextItem;
  }
}
