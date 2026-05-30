"use client";

import { gsap } from "@ui/gsap";
import { useEffect, useRef, type ReactNode } from "react";

type FullscreenScrollerProps = {
  children: ReactNode;
};

export function FullscreenScroller({ children }: FullscreenScrollerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-section]"));

    const currentIndex = () => {
      const viewportMiddle = window.scrollY + window.innerHeight / 2;
      return Math.max(
        0,
        sections.findIndex((section, index) => {
          const nextSection = sections[index + 1];
          const start = section.offsetTop;
          const end = nextSection?.offsetTop ?? Number.POSITIVE_INFINITY;
          return viewportMiddle >= start && viewportMiddle < end;
        }),
      );
    };

    const scrollToSection = (index: number) => {
      const target = sections[Math.min(Math.max(index, 0), sections.length - 1)];
      if (!target || isAnimating.current) {
        return;
      }

      const startY = window.scrollY;
      const targetY = target.offsetTop;
      const state = { y: startY };

      isAnimating.current = true;
      gsap.to(state, {
        y: targetY,
        duration: 0.9,
        ease: "power3.inOut",
        onUpdate: () => window.scrollTo(0, state.y),
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 10) {
        return;
      }

      event.preventDefault();
      scrollToSection(currentIndex() + (event.deltaY > 0 ? 1 : -1));
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
      const delta = touchStartY.current - endY;
      if (Math.abs(delta) < 48) {
        return;
      }
      scrollToSection(currentIndex() + (delta > 0 ? 1 : -1));
    };

    const onAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href^='#']");
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") {
        return;
      }

      const targetIndex = sections.findIndex((section) => `#${section.id}` === hash);
      if (targetIndex < 0) {
        return;
      }

      event.preventDefault();
      scrollToSection(targetIndex);
      history.replaceState(null, "", hash);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("click", onAnchorClick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("click", onAnchorClick);
    };
  }, []);

  return (
    <div className="fullscreen-scroller" ref={rootRef}>
      {children}
    </div>
  );
}
