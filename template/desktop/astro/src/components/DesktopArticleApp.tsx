"use client";

import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { create } from "zustand";

type LoginStage = "idle" | "running" | "success" | "error";

type LoginCommandResult = {
  ok: boolean;
  status: string;
  message: string;
  logs: string[];
};

type LoginState = {
  stage: LoginStage;
  message: string;
  logs: string[];
  runGoogleLogin: () => Promise<void>;
};

const useLoginStore = create<LoginState>((set) => ({
  stage: "idle",
  message: "준비됨",
  logs: [],
  runGoogleLogin: async () => {
    set({
      stage: "running",
      message: "Playwright 실행 중...",
      logs: ["UI trigger: runGoogleLogin"],
    });

    const tauriPresent = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
    if (!tauriPresent) {
      let popupMessage = "handler: browser fallback";
      try {
        const popup = window.open("https://accounts.google.com/signin", "_blank", "noopener,noreferrer");
        popupMessage = popup ? "handler: browser fallback popup opened" : "handler: browser fallback popup blocked";
      } catch {
        popupMessage = "handler: browser fallback popup failed";
      }
      set((state) => ({
        stage: "success",
        message: "브라우저 모드에서 로그인 페이지를 열었습니다.",
        logs: [...state.logs, popupMessage, "state: success"],
      }));
      return;
    }

    try {
      const result = await invoke<LoginCommandResult>("run_google_login");
      set((state) => ({
        stage: result.ok ? "success" : "error",
        message: result.message,
        logs: [
          ...state.logs,
          "handler: invoke(run_google_login)",
          `state: ${result.status}`,
          ...result.logs,
        ],
      }));
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      set((state) => ({
        stage: "error",
        message: "자동 로그인 실행 실패",
        logs: [...state.logs, `error: ${detail}`],
      }));
    }
  },
}));

const badgeText = (stage: LoginStage) => {
  if (stage === "running") return "RUNNING";
  if (stage === "success") return "SUCCESS";
  if (stage === "error") return "ERROR";
  return "IDLE";
};

export const DesktopArticleApp = () => {
  const [isReady, setReady] = useState(false);
  const { stage, message, logs, runGoogleLogin } = useLoginStore();

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="desktop-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">AUTOMATION</div>
        <div className="sidebar-group">
          <p className="sidebar-title">WORKSPACE</p>
          <button type="button" data-testid="login-trigger" className="sidebar-button" onClick={runGoogleLogin}>
            Google Login
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="main-header">
          <h1>Tauri + Playwright Login Runner</h1>
          <span data-testid="status-badge" className={`status-badge status-${stage}`}>
            {badgeText(stage)}
          </span>
        </header>

        <section className="status-card">
          <p data-testid="app-ready">{isReady ? "ready" : "loading"}</p>
          <p data-testid="status-message">{message}</p>
          <p className="hint">
            환경변수 <code>GOOGLE_EMAIL</code>, <code>GOOGLE_PASSWORD</code>를 설정하면 자동 입력까지 수행합니다.
          </p>
        </section>

        <section className="log-card">
          <h2>Execution Log</h2>
          <ol data-testid="status-logs">
            {logs.map((log, index) => (
              <li key={`${log}-${index}`}>{log}</li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
};
