"use client";

import { ArticleEditor } from "@features/editor";
import { Footer, Header, ListArticle } from "@ui/shadcn";
import type { Article, ArticleRule, NewArticle } from "@domain/article";
import { createArticleModel } from "@domain/article";
import { createUserModel } from "@domain/user";
import { useEffect, useMemo, useState } from "react";

type SqlDatabase = {
  execute: (query: string, bindValues?: unknown[]) => Promise<unknown>;
  select: <T>(query: string, bindValues?: unknown[]) => Promise<T[]>;
};

type PersistedArticle = Article & { author_id: string };

type ArticleStore = {
  listArticles: () => Promise<PersistedArticle[]>;
  createArticle: (input: NewArticle, authorId: string) => Promise<PersistedArticle>;
};

const newId = () => crypto.randomUUID();

const browserStore = (): ArticleStore => {
  const rows: PersistedArticle[] = [];
  return {
    listArticles: async () => rows,
    createArticle: async (input, authorId) => {
      const row = { ...createArticleModel(input, newId()), author_id: authorId };
      rows.unshift(row);
      return row;
    },
  };
};

const createSqliteStore = async (): Promise<ArticleStore> => {
  const { default: Database } = await import("@tauri-apps/plugin-sql");
  const db = (await Database.load("sqlite:desktop_astro.db")) as SqlDatabase;

  await db.execute(
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, pw TEXT NOT NULL, created_at TEXT NOT NULL, modified_at TEXT NOT NULL)"
  );
  await db.execute(
    "CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL, rule TEXT NOT NULL, author_id TEXT NOT NULL, created_at TEXT NOT NULL, modified_at TEXT NOT NULL, FOREIGN KEY(author_id) REFERENCES users(id))"
  );

  const users = await db.select<{ id: string }>("SELECT id FROM users LIMIT 1");
  if (users.length === 0) {
    const user = createUserModel({ name: "desktop-user", pw: "local-only" }, newId());
    await db.execute(
      "INSERT INTO users (id, name, pw, created_at, modified_at) VALUES (?, ?, ?, ?, ?)",
      [user.id, user.name, user.pw, user.created_at, user.modified_at]
    );
  }

  return {
    listArticles: async () =>
      db.select<PersistedArticle>(
        "SELECT id, title, body, rule, author_id, created_at, modified_at FROM articles ORDER BY created_at DESC"
      ),
    createArticle: async (input, authorId) => {
      const article = createArticleModel(input, newId());
      await db.execute(
        "INSERT INTO articles (id, title, body, rule, author_id, created_at, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          article.id,
          article.title,
          article.body,
          article.rule,
          authorId,
          article.created_at,
          article.modified_at,
        ]
      );

      return { ...article, author_id: authorId };
    },
  };
};

const createStore = async (): Promise<ArticleStore> => {
  const tauriPresent = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
  if (!tauriPresent) {
    return browserStore();
  }

  try {
    return await createSqliteStore();
  } catch {
    return browserStore();
  }
};

export const DesktopArticleApp = () => {
  const seededUser = useMemo(() => createUserModel({ name: "desktop-user", pw: "local-only" }, "user-1"), []);
  const [store, setStore] = useState<ArticleStore | null>(null);
  const [articles, setArticles] = useState<PersistedArticle[]>([]);
  const [isReady, setReady] = useState(false);
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rule, setRule] = useState<ArticleRule>("public");

  useEffect(() => {
    void (async () => {
      const nextStore = await createStore();
      setStore(nextStore);
      setArticles(await nextStore.listArticles());
      setReady(true);
    })();
  }, []);

  const resetEditor = () => {
    setTitle("");
    setBody("");
    setRule("public");
  };

  const saveArticle = async () => {
    if (!store || title.trim().length === 0) {
      return;
    }

    await store.createArticle({ title: title.trim(), body, rule }, seededUser.id);
    setArticles(await store.listArticles());
    resetEditor();
    setEditorOpen(false);
  };

  return (
    <div className="desktop-template">
      <Header authUserLabel={seededUser.name} />
      <main className="desktop-main">
        <section className="desktop-toolbar">
          <h1>Desktop Article Template</h1>
          <p data-testid="app-ready">{isReady ? "ready" : "loading"}</p>
          <p data-testid="article-count">count: {articles.length}</p>
          <button
            type="button"
            data-testid="open-editor"
            className="primary-button"
            onClick={() => setEditorOpen(true)}
          >
            Add Article
          </button>
        </section>

        <section>
          <ListArticle articles={articles} />
        </section>
      </main>

      {isEditorOpen ? (
        <div className="editor-modal" role="dialog" aria-modal="true" data-testid="editor-modal">
          <div className="editor-panel">
            <h2>Create Article</h2>
            <label className="field">
              <span>Title</span>
              <input
                data-testid="editor-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="article title"
              />
            </label>

            <label className="field">
              <span>Rule</span>
              <select
                data-testid="editor-rule"
                value={rule}
                onChange={(event) => setRule(event.target.value as ArticleRule)}
              >
                <option value="public">public</option>
                <option value="private">private</option>
                <option value="protected">protected</option>
              </select>
            </label>

            <ArticleEditor value={body} onChange={setBody} />

            <div className="editor-actions">
              <button type="button" onClick={() => setEditorOpen(false)}>
                Cancel
              </button>
              <button type="button" data-testid="save-article" className="primary-button" onClick={saveArticle}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
};
