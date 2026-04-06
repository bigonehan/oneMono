import type { Message } from "../models/message.js";

export const filter_conversation = (
  messages: Message[],
  user_id: string,
  peer_user_id: string,
): Message[] => {
  return messages
    .filter(
      (message) =>
        (message.sender_id === user_id && message.receiver_id === peer_user_id) ||
        (message.sender_id === peer_user_id && message.receiver_id === user_id),
    )
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
};
