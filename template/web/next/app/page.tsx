"use client";

import { Footer, Header } from "@ui/shadcn";
import Lenis from "lenis";
import { useEffect } from "react";

const sections = [
  { id: "section-1", title: "Section 1", color: "section--one" },
  { id: "section-2", title: "Section 2", color: "section--two" },
  { id: "section-3", title: "Section 3", color: "section--three" },
  { id: "section-4", title: "Section 4", color: "section--four" },
  { id: "section-5", title: "Section 5", color: "section--five" },
];

export default function Home() {
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
      <Header />

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
