import type { FC } from "react";

type AppHeaderProps = {
  current: "home" | "configs";
};

const linkClass = (active: boolean) =>
  active ? "app-header__link app-header__link--active" : "app-header__link";

export const AppHeader: FC<AppHeaderProps> = ({ current }) => {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <a className="app-header__brand" href="/">
          Agent Runner
        </a>
        <nav className="app-header__nav" aria-label="Primary">
          <a className={linkClass(current === "home")} href="/">
            Chat
          </a>
          <a className={linkClass(current === "configs")} href="/configs">
            Configs
          </a>
        </nav>
      </div>
    </header>
  );
};
