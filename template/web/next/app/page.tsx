"use client";

import { Footer, Header } from "@ui/shadcn";
import Lenis from "lenis";
import { useEffect, useState } from "react";

const sections = [
  { id: "section-1", title: "Section 1", color: "section--one" },
  { id: "section-2", title: "Section 2", color: "section--two" },
  { id: "section-3", title: "Section 3", color: "section--three" },
  { id: "section-4", title: "Section 4", color: "section--four" },
  { id: "section-5", title: "Section 5", color: "section--five" },
];

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="template-root">
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

      <div
        className={`mobile-overlay ${isMobileMenuOpen ? "is-open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />

      <aside className={`mobile-side-menu ${isMobileMenuOpen ? "is-open" : ""}`} aria-label="Mobile menu">
        <nav className="mobile-side-menu__nav">
          <a href="#section-1" onClick={() => setIsMobileMenuOpen(false)}>
            Blog
          </a>
          <a href="#section-2" onClick={() => setIsMobileMenuOpen(false)}>
            Profile
          </a>
        </nav>
      </aside>

      <main className="template-body">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className={`section ${section.color}`}>
            <h2>{section.title}</h2>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
