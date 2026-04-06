"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Main" },
  { href: "/profile", label: "Profile" },
  { href: "/qa", label: "QA" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="app-navbar" aria-label="Global navigation">
      <div className="app-navbar__inner">
        <Link href="/" className="app-navbar__brand">
          Main Profile QA
        </Link>
        <nav className="app-navbar__nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`app-navbar__link ${isActive ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button type="button" className="app-navbar__login" aria-label="Open login">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.87 0-7 2.24-7 5v1h14v-1c0-2.76-3.13-5-7-5Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
