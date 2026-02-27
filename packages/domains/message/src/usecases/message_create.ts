import type { Message, NewMessage } from "../models/message.js";

export const create_message_model = (input: NewMessage, id: string): Message => {
  const now = new Date().toISOString();

  return {
    id,
    sender_id: input.sender_id,
    receiver_id: input.receiver_id,
    body: input.body,
    read_at: null,
    created_at: now,
    modified_at: now,
  };
};
