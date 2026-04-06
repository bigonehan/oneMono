"use client";

import { useState } from "react";

export type message_compose_payload = {
  receiver_id: string;
  body: string;
};

type message_compose_props = {
  on_submit?: (payload: message_compose_payload) => void;
  placeholder?: string;
  submit_label?: string;
};

export const message_compose = ({
  on_submit,
  placeholder = "쪽지를 입력하세요",
  submit_label = "보내기",
}: message_compose_props) => {
  const [receiver_id, set_receiver_id] = useState("");
  const [body, setBody] = useState("");

  return (
    <form
      className="message-compose"
      onSubmit={(event) => {
        event.preventDefault();
        if (!receiver_id.trim() || !body.trim()) {
          return;
        }

        on_submit?.({ receiver_id: receiver_id.trim(), body: body.trim() });
        setBody("");
      }}
    >
      <label>
        받는 사람 ID
        <input
          value={receiver_id}
          onChange={(event) => set_receiver_id(event.target.value)}
          placeholder="receiver id"
        />
      </label>
      <label>
        내용
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      </label>
      <button type="submit">{submit_label}</button>
    </form>
  );
};
