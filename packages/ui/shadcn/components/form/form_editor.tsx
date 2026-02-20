"use client";

import { useState } from "react";

type FormEditorProps = {
  onSubmit?: (payload: { title: string; body: string; rule: string }) => void;
};

export const FormEditor = ({ onSubmit }: FormEditorProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rule, setRule] = useState("public");

  return (
    <form
      className="grid gap-3 rounded-lg border p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.({ title, body, rule });
      }}
    >
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="h-10 rounded-md border px-3"
        placeholder="title"
      />

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="min-h-40 rounded-md border p-3"
        placeholder="body"
      />

      <select
        value={rule}
        onChange={(event) => setRule(event.target.value)}
        className="h-10 rounded-md border px-3"
      >
        <option value="public">public</option>
        <option value="private">private</option>
        <option value="protected">protected</option>
      </select>

      <button type="submit" className="h-10 rounded-md bg-black text-white">
        Save Article
      </button>
    </form>
  );
};
