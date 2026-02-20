import { HamburgerIcon } from "../icons/hamburger";

type HeaderProps = {
  onMenuClick?: () => void;
  onTableClick?: () => void;
};

export const Header = ({ onMenuClick, onTableClick }: HeaderProps) => (
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
    </nav>
  </header>
);
