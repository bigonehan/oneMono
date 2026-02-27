import type { Message, NewMessage } from "./models/message.js";

export interface MessagePort {
  createMessage(input: NewMessage): Promise<Message>;
  getMessageById(messageId: string): Promise<Message | null>;
  listMessages(): Promise<Message[]>;
  listConversation(userId: string, peerUserId: string): Promise<Message[]>;
  markAsRead(messageId: string, readAt: string): Promise<Message | null>;
  deleteMessage(messageId: string): Promise<boolean>;
}
