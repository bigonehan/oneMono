import type { User } from "@domain/user";

type DashboardUserPanelProps = {
  users: User[];
  title?: string;
};

const formatDateTime = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("ko-KR", { hour12: false });
};

const maskPassword = (value: string): string => "*".repeat(Math.max(8, value.length));

export const DashboardUserPanel = ({ users, title = "User Dashboard" }: DashboardUserPanelProps) => {
  return (
    <section
      style={{
        border: "1px solid rgba(0, 0, 0, 0.14)",
        borderRadius: 12,
        background: "#ffffff",
        padding: 16,
      }}
    >
      <header style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <p style={{ margin: "6px 0 0", color: "#4b5563" }}>총 사용자 수: {users.length}</p>
      </header>

      {users.length === 0 ? (
        <p style={{ margin: 0 }}>표시할 사용자가 없습니다.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {users.map((user) => (
            <article
              key={user.id}
              style={{
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: 10,
                padding: 12,
                background: "#f8fafc",
              }}
            >
              <p style={{ margin: 0, fontWeight: 700 }}>{user.name}</p>
              <p style={{ margin: "4px 0 0" }}>ID: {user.id}</p>
              <p style={{ margin: "4px 0 0" }}>PW: {maskPassword(user.pw)}</p>
              <p style={{ margin: "4px 0 0" }}>생성일: {formatDateTime(user.created_at)}</p>
              <p style={{ margin: "4px 0 0" }}>수정일: {formatDateTime(user.modified_at)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export type { DashboardUserPanelProps };
