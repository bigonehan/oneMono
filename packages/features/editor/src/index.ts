"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { NewArticle } from "@domain/article";

type EditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export const ArticleEditor = ({
  value = "",
  onChange,
  placeholder = "Write your article...",
}: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || `<p>${placeholder}</p>`,
    onUpdate: ({ editor: nextEditor }) => {
      onChange?.(nextEditor.getHTML());
    },
  });

  return <EditorContent editor={editor} />;
};

export type EditorDraft = Pick<NewArticle, "title" | "body" | "rule">;
