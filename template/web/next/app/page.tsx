"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FormLogin, FormSignUp, type LoginPayload, type SignUpPayload } from "@features/auth";
import { READER_DEFAULT_SPEED, TypingTextReader } from "@features/reader";
import { Lenis, SlideUpText } from "@ui/motion";
import { Footer, Header } from "@ui/shadcn";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type UserTaskRow = {
  userName: string;
  userEmail: string;
  taskTitle: string;
  taskStatus: string;
};

type AuthUser = {
  userId: string;
  loginId: string;
  name: string;
};

type AuthResponse = {
  ok: boolean;
  message?: string;
  user: AuthUser | null;
};

const sections = [
  { id: "section-1", title: "Section 1", color: "section--one" },
  { id: "section-2", title: "Section 2", color: "section--two" },
  { id: "section-3", title: "Section 3", color: "section--three" },
  { id: "section-4", title: "Section 4", color: "section--four" },
  { id: "section-5", title: "Section 5", color: "section--five" },
];

const scrollToAuthSection = () => {
  const authSection = document.getElementById("auth-section");
  if (authSection) {
    authSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export default function Home() {
  const READER_SPEED_MIN = 20;
  const READER_SPEED_MAX = 300;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rows, setRows] = useState<UserTaskRow[]>([]);
  const [seedCount, setSeedCount] = useState(1);
  const [loginResult, setLoginResult] = useState<string>("");
  const [signUpResult, setSignUpResult] = useState<string>("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [readerInput, setReaderInput] = useState(
    "PixiJS Reader는 입력한 문장을 타이핑 애니메이션으로 표현합니다.",
  );
  const [readerText, setReaderText] = useState(
    "PixiJS Reader는 입력한 문장을 타이핑 애니메이션으로 표현합니다.",
  );
  const [readerSpeed, setReaderSpeed] = useState(READER_DEFAULT_SPEED);
  const [readerRenderKey, setReaderRenderKey] = useState(0);

  const columns = useMemo(() => {
    const column = createColumnHelper<UserTaskRow>();
    return [
      column.accessor("userName", { header: "User" }),
      column.accessor("userEmail", { header: "Email" }),
      column.accessor("taskTitle", { header: "Task" }),
      column.accessor("taskStatus", { header: "Status" }),
    ];
  }, []);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        const data = (await response.json()) as AuthResponse;
        setAuthUser(data.user);
      } catch {
        setAuthUser(null);
      }
    };

    void fetchCurrentUser();
  }, []);

  const createUserTaskByMenu = async () => {
    const next = seedCount;
    const createdRows: UserTaskRow[] = [
      {
        userName: `User ${next}`,
        userEmail: `user${next}@example.com`,
        taskTitle: `Task ${next}-1`,
        taskStatus: "todo",
      },
      {
        userName: `User ${next}`,
        userEmail: `user${next}@example.com`,
        taskTitle: `Task ${next}-2`,
        taskStatus: "in-progress",
      },
    ];
    setSeedCount((count) => count + 1);
    setRows((prev) => [...prev, ...createdRows]);

    const tableSection = document.getElementById("table-section");
    if (tableSection) {
      tableSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const login = async (payload: LoginPayload) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as AuthResponse;

      if (!response.ok || !data.ok || !data.user) {
        setLoginResult(data.message ?? "로그인 실패");
        return;
      }

      setAuthUser(data.user);
      setLoginResult(`로그인 성공: ${data.user.name} (${data.user.loginId})`);
      setSignUpResult("");
    } catch {
      setLoginResult("로그인 요청 실패");
    }
  };

  const signUp = async (payload: SignUpPayload) => {
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as AuthResponse;

      if (!response.ok || !data.ok || !data.user) {
        setSignUpResult(data.message ?? "회원가입 실패");
        return;
      }

      setSignUpResult(`회원가입 완료: ${data.user.name} (${data.user.loginId})`);
      setLoginResult("회원가입 후 Login으로 로그인하세요.");
    } catch {
      setSignUpResult("회원가입 요청 실패");
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAuthUser(null);
      setLoginResult("로그아웃 완료");
    }
  };

  const playReaderText = () => {
    const normalized = readerInput.trim();
    if (!normalized) {
      return;
    }

    setReaderText(normalized);
    setReaderRenderKey((prev) => prev + 1);
  };

  const readerIntervalMs = READER_SPEED_MAX - readerSpeed + READER_SPEED_MIN;

  return (
    <div className="template-root">
      <Header
        onMenuClick={() => setIsMobileMenuOpen(true)}
        onTableClick={() => {
          void createUserTaskByMenu();
        }}
        onLoginClick={scrollToAuthSection}
        onSignUpClick={scrollToAuthSection}
        onLogoutClick={() => {
          void logout();
        }}
        authUserLabel={authUser ? `${authUser.name} (${authUser.loginId})` : undefined}
      />

      <div
        className={`mobile-overlay ${isMobileMenuOpen ? "is-open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />

      <aside className={`mobile-side-menu ${isMobileMenuOpen ? "is-open" : ""}`} aria-label="Mobile menu">
        <nav className="mobile-side-menu__nav">
          <a href="#section-1" onClick={() => setIsMobileMenuOpen(false)}>
            Blog
          </a>
          <a href="#section-2" onClick={() => setIsMobileMenuOpen(false)}>
            Profile
          </a>
          <Link href="/dash" onClick={() => setIsMobileMenuOpen(false)}>
            Dash
          </Link>
          <Link href="/post" onClick={() => setIsMobileMenuOpen(false)}>
            Post
          </Link>
          {authUser ? (
            <button
              type="button"
              className="template-header__auth-button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                void logout();
              }}
            >
              Logout ({authUser.loginId})
            </button>
          ) : (
            <>
              <a href="#auth-section" onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </a>
              <a href="#auth-section" onClick={() => setIsMobileMenuOpen(false)}>
                Signin
              </a>
            </>
          )}
        </nav>
      </aside>

      <main className="template-body">
        <section id="auth-section" className="auth-section">
          <h2>Auth Forms</h2>
          <p>
            {authUser
              ? `로그인 중: ${authUser.name} (${authUser.loginId})`
              : "Header의 Login/Signin 메뉴로 이동 후 인증을 테스트하세요."}
          </p>
          <div className="auth-grid">
            <article className="auth-card">
              <h3>Login</h3>
              <FormLogin
                onSubmit={(payload) => {
                  void login(payload);
                }}
              />
              <p className="auth-result">{loginResult || "아직 제출되지 않았습니다."}</p>
            </article>
            <article className="auth-card">
              <h3>Sign Up</h3>
              <FormSignUp
                onSubmit={(payload) => {
                  void signUp(payload);
                }}
              />
              <p className="auth-result">{signUpResult || "아직 제출되지 않았습니다."}</p>
            </article>
          </div>
        </section>

        <section id="table-section" className="table-section">
          <h2>User + Task Table</h2>
          <p>Click Header `Table` to create user and related task rows.</p>
          <div className="table-shell">
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No rows yet. Use Header Table menu.</td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="reader-inline-section">
          <h2>Reader Typing Demo</h2>
          <p>텍스트를 입력하고 재생하면 PixiJS 캔버스에 타이핑 형태로 렌더링됩니다.</p>
          <div className="reader-inline-section__controls">
            <textarea
              value={readerInput}
              onChange={(event) => setReaderInput(event.target.value)}
              rows={3}
              placeholder="타이핑할 텍스트를 입력하세요"
            />
            <label htmlFor="reader-speed">Typing Speed: {readerSpeed}</label>
            <input
              id="reader-speed"
              type="range"
              min={READER_SPEED_MIN}
              max={READER_SPEED_MAX}
              step={10}
              value={readerSpeed}
              onChange={(event) => setReaderSpeed(Number(event.target.value))}
            />
            <button type="button" onClick={playReaderText} disabled={!readerInput.trim()}>
              타이핑 재생
            </button>
          </div>
          <div className="reader-inline-section__preview" aria-live="polite">
            <TypingTextReader
              key={readerRenderKey}
              text={readerText}
              intervalMs={readerIntervalMs}
              height={220}
            />
          </div>
        </section>

        {sections.map((section) => (
          <section key={section.id} id={section.id} className={`section ${section.color}`}>
            <SlideUpText text={section.title} />
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
