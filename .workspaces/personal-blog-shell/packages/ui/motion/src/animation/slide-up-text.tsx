"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type SlideUpTextProps = {
  text: ReactNode;
  className?: string;
  delay?: number;
};

export function SlideUpText({ text, className, delay = 0 }: SlideUpTextProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const element = ref.current;
    if (!element) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, element);

    return () => {
      ctx.revert();
    };
  }, [delay]);

  return <h2 ref={ref} className={className}>{text}</h2>;
}
