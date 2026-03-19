"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { NewArticle } from "@domain/article";
import { createElement, useEffect, type ReactElement } from "react";

type EditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export const ArticleEditor = ({
  value = "",
  onChange,
  placeholder = "Write your article...",
}: EditorProps): ReactElement => {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
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

  return createElement(EditorContent, { editor }) as ReactElement;
};

export type EditorDraft = Pick<NewArticle, "title" | "body" | "rule">;
