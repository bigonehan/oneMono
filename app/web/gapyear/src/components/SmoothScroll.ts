"use client";
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafId: number | null = null;
    let isUnmounted = false;

    const initLenis = async () => {
      // Lenis 동적 import
      const Lenis = (await import('lenis')).default;

      if (isUnmounted) {
        return;
      }
      
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      
      // Lenis와 ScrollTrigger 연결
      lenis.on('scroll', ScrollTrigger.update);
      
      // requestAnimationFrame 루프
      const raf = (time: number) => {
        if (!lenis || isUnmounted) {
          return;
        }

        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      
      rafId = requestAnimationFrame(raf);
    };
    
    initLenis();
    
    // cleanup
    return () => {
      isUnmounted = true;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      if (lenis) {
        lenis.destroy();
      }

      lenis = null;
    };
  }, []);
  
  return null;
}
