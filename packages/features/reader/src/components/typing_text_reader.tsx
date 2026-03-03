"use client";

import { Application, Container, Text, TextStyle } from "pixi.js";
import { useEffect, useRef } from "react";
import { READER_DEFAULT_SPEED } from "../reader_config";

export type TypingTextReaderProps = {
  text: string;
  width?: number;
  height?: number;
  intervalMs?: number;
  loop?: boolean;
  fontFamily?: string;
  fontSize?: number;
  fill?: string | number;
  lineHeight?: number;
  onComplete?: () => void;
};

export const TypingTextReader = ({
  text,
  width = 760,
  height = 180,
  intervalMs = READER_DEFAULT_SPEED,
  loop = false,
  fontFamily = "Pretendard, sans-serif",
  fontSize = 32,
  fill = "#111111",
  lineHeight = 42,
  onComplete,
}: TypingTextReaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) {
      return;
    }

    const app = new Application({
      width,
      height,
      antialias: true,
      backgroundAlpha: 0,
    });

    const view = app.view as HTMLCanvasElement;
    view.style.width = "100%";
    view.style.height = "100%";
    host.appendChild(view);

    const textStyle = new TextStyle({
      fontFamily,
      fontSize,
      fill,
      lineHeight,
      wordWrap: true,
      wordWrapWidth: width - 24,
    });

    const container = new Container();
    const typingText = new Text("", textStyle);
    typingText.x = 12;
    typingText.y = 12;
    container.addChild(typingText);
    app.stage.addChild(container);

    let currentIndex = 0;
    const timer = window.setInterval(() => {
      if (currentIndex >= text.length) {
        if (loop) {
          currentIndex = 0;
          typingText.text = "";
          return;
        }

        window.clearInterval(timer);
        onComplete?.();
        return;
      }

      currentIndex += 1;
      typingText.text = text.slice(0, currentIndex);
    }, intervalMs);

    const resize = () => {
      const nextWidth = Math.max(240, Math.floor(host.clientWidth || width));
      app.renderer.resize(nextWidth, height);
      textStyle.wordWrapWidth = nextWidth - 24;
      typingText.style = textStyle;
    };

    resize();

    const observer = new ResizeObserver(() => {
      resize();
    });
    observer.observe(host);
    window.addEventListener("resize", resize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.clearInterval(timer);
      app.destroy(true, { children: true });
    };
  }, [fill, fontFamily, fontSize, height, intervalMs, lineHeight, loop, onComplete, text, width]);

  return <div ref={containerRef} style={{ width: "100%", height }} />;
};
