"use client";

import { Header } from "@ui/shadcn";

const navItems = [
  { href: "#hero", label: "Main" },
  { href: "#showcase", label: "Showcase" },
  { href: "#sections", label: "Sections" },
];

export function Navbar() {
  return (
    <Header
      brandLabel="Next Barebone"
      navItems={navItems}
      actionLabel="Start"
      onActionClick={() => document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" })}
    />
  );
}
