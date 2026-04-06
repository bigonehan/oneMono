import { HamburgerIcon } from "../icons/hamburger";

type HeaderProps = {
  onMenuClick?: () => void;
  onTableClick?: () => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onLogoutClick?: () => void;
  authUserLabel?: string;
  dashHref?: string;
  postHref?: string;
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

    <nav className="template-header__nav" aria-label="Main">
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
    </nav>
  </header>
);
