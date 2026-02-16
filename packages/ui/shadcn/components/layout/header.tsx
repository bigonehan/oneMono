import { HamburgerIcon } from "../icons/hamburger";

type HeaderProps = {
  onMenuClick?: () => void;
};

export const Header = ({ onMenuClick }: HeaderProps) => (
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
      <a href="#section-1">Blog</a>
      <a href="#section-2">Profile</a>
    </nav>
  </header>
);
