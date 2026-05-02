import { HamburgerIcon } from "../icons/hamburger";

type HeaderNavItem = {
  href: string;
  label: string;
};

type HeaderProps = {
  onMenuClick?: () => void;
  onTableClick?: () => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onLogoutClick?: () => void;
  authUserLabel?: string;
  dashHref?: string;
  postHref?: string;
  brandLabel?: string;
  navItems?: HeaderNavItem[];
  actionLabel?: string;
  onActionClick?: () => void;
};

export const Header = ({
  onMenuClick,
  onTableClick,
  onLoginClick,
  onSignUpClick,
  onLogoutClick,
  authUserLabel,
  dashHref = "/dash",
  postHref = "/post",
  brandLabel,
  navItems,
  actionLabel,
  onActionClick,
}: HeaderProps) => (
  <header className="template-header">
    <button
      type="button"
      className="template-header__menu"
      onClick={onMenuClick}
      aria-label="Open menu"
    >
      <HamburgerIcon />
    </button>

    {brandLabel ? (
      <a className="template-header__brand" href="#hero">
        {brandLabel}
      </a>
    ) : null}

    <nav className="template-header__nav" aria-label="Main">
      {navItems ? (
        navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))
      ) : (
        <>
          <a
            href="#table-section"
            className="template-header__table"
            data-table-action
            onClick={(event) => {
              if (!onTableClick) {
                return;
              }
              event.preventDefault();
              onTableClick();
            }}
          >
            Table
          </a>
          <a href="#section-1">Blog</a>
          <a href="#section-2">Profile</a>
          <a href={dashHref}>Dash</a>
          <a href={postHref}>Post</a>
        </>
      )}
      {authUserLabel ? (
        <>
          <span className="template-header__user">{authUserLabel}</span>
          <button
            type="button"
            className="template-header__auth-button"
            onClick={() => onLogoutClick?.()}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          {actionLabel ? (
            <button
              type="button"
              className="template-header__auth-button"
              onClick={() => onActionClick?.()}
            >
              {actionLabel}
            </button>
          ) : (
            <>
              <a
                href="#auth-section"
                onClick={(event) => {
                  if (!onLoginClick) {
                    return;
                  }
                  event.preventDefault();
                  onLoginClick();
                }}
              >
                Login
              </a>
              <a
                href="#auth-section"
                onClick={(event) => {
                  if (!onSignUpClick) {
                    return;
                  }
                  event.preventDefault();
                  onSignUpClick();
                }}
              >
                Signin
              </a>
            </>
          )}
        </>
      )}
    </nav>
  </header>
);

export type { HeaderNavItem, HeaderProps };
