"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashUserOverview, type DashUser } from "@ui/shadcn";

type AuthResponse = {
  ok: boolean;
  user: DashUser | null;
};

export default function DashPage() {
  const [user, setUser] = useState<DashUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = (await response.json()) as AuthResponse;
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <main className="dash-page">
      <header className="dash-page__header">
        <h1>Dash</h1>
        <p>메뉴에서 이동한 대시보드 화면입니다.</p>
        <Link href="/">Home</Link>
      </header>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <DashUserOverview user={user} title="User Dashboard" />
      )}
    </main>
  );
}
