"use client";

import { useState } from "react";

const boardItems = [
  { title: "라우팅 구조 질문", status: "open" },
  { title: "반응형 navbar 문의", status: "review" },
  { title: "profile carousel 개선", status: "done" },
  { title: "qa 채팅 연결", status: "open" },
];

export default function QaPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="qa-page">
      <header className="qa-page__header">
        <h1>QA</h1>
        <p>게시판 리스트와 채팅 토글 버튼을 제공합니다.</p>
      </header>

      <ul className="qa-board" aria-label="QA board list">
        {boardItems.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.status}</span>
          </li>
        ))}
      </ul>

      {chatOpen ? (
        <section className="qa-chat" aria-label="QA chat window">
          <h2>Chat</h2>
          <p>질문을 입력하면 상담 흐름이 시작됩니다.</p>
        </section>
      ) : null}

      <button
        type="button"
        className="qa-chat-toggle"
        onClick={() => setChatOpen((prev) => !prev)}
        aria-label="Toggle chat"
      >
        {chatOpen ? "-" : "+"}
      </button>
    </div>
  );
}
