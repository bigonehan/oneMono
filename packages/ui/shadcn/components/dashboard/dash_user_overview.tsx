type DashUser = {
  userId: string;
  loginId: string;
  name: string;
};

type DashUserOverviewProps = {
  title?: string;
  description?: string;
  user: DashUser | null;
};

export const DashUserOverview = ({
  title = "Dash",
  description = "현재 로그인 사용자 정보를 확인합니다.",
  user,
}: DashUserOverviewProps) => {
  return (
    <section className="dash-card">
      <header className="dash-card__header">
        <h2>{title}</h2>
        <p>{description}</p>
      </header>

      {!user ? (
        <p className="dash-card__empty">로그인한 사용자가 없습니다.</p>
      ) : (
        <dl className="dash-card__grid">
          <div>
            <dt>Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt>Login ID</dt>
            <dd>{user.loginId}</dd>
          </div>
          <div>
            <dt>User ID</dt>
            <dd>{user.userId}</dd>
          </div>
        </dl>
      )}
    </section>
  );
};

export type { DashUser, DashUserOverviewProps };
