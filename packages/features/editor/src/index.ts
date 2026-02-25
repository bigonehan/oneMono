"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { NewArticle } from "@domain/article";
import { useEffect } from "react";

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

  useEffect(() => {
    if (!editor) {
      return;
    }

    const fallback = `<p>${placeholder}</p>`;
    const nextValue = value || fallback;
    if (editor.getHTML() !== nextValue) {
      editor.commands.setContent(nextValue, false);
    }
  }, [editor, value, placeholder]);

  return EditorContent({ editor });
};

export type EditorDraft = Pick<NewArticle, "title" | "body" | "rule">;
