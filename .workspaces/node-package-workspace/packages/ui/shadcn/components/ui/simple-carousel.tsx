"use client";

import { useMemo, useState, type ReactNode } from "react";

type SimpleCarouselProps = {
  items: ReactNode[];
  ariaLabel: string;
  className?: string;
};

export function SimpleCarousel({ items, ariaLabel, className }: SimpleCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = items.length;

  const current = useMemo(() => items[index] ?? null, [items, index]);

  if (total === 0) {
    return null;
  }

  return (
    <section className={className} aria-label={ariaLabel}>
      <div>{current}</div>
      <div className="ui-simple-carousel__controls">
        <button
          type="button"
          onClick={() => setIndex((prev) => (prev - 1 + total) % total)}
          aria-label="Previous item"
        >
          Prev
        </button>
        <p className="ui-simple-carousel__meta">
          {index + 1} / {total}
        </p>
        <button
          type="button"
          onClick={() => setIndex((prev) => (prev + 1) % total)}
          aria-label="Next item"
        >
          Next
        </button>
      </div>
    </section>
  );
}
