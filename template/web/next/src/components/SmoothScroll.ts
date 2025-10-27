"use client";
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: any;
    
    const initLenis = async () => {
      // Lenis 동적 import
      const Lenis = (await import('lenis')).default;
      
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      
      // Lenis와 ScrollTrigger 연결
      lenis.on('scroll', ScrollTrigger.update);
      
      // requestAnimationFrame 루프
      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      
      requestAnimationFrame(raf);
    };
    
    initLenis();
    
    // cleanup
    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);
  
  return null;
}
