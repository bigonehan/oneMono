import type { JSX } from "react";

export type chat_message_item = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type message_chat_window_props = {
  current_user_id: string;
  messages: chat_message_item[];
  empty_text?: string;
};

export function message_chat_window({
  current_user_id,
  messages,
  empty_text = "대화가 아직 없습니다.",
}: message_chat_window_props): JSX.Element {
  if (messages.length === 0) {
    return <p className="message-chat-window-empty">{empty_text}</p>;
  }

  return (
    <ul className="message-chat-window" aria-label="message conversation">
      {messages.map((message) => {
        const is_mine = message.sender_id === current_user_id;

        return (
          <li
            key={message.id}
            className={is_mine ? "message-chat-item message-chat-item--mine" : "message-chat-item"}
          >
            <p>{message.body}</p>
            <small>{message.created_at}</small>
          </li>
        );
      })}
    </ul>
  );
}
