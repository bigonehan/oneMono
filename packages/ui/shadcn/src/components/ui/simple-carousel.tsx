"use client";

import { useState, type ReactNode } from "react";

type SimpleCarouselProps = {
  items: ReactNode[];
  ariaLabel?: string;
  className?: string;
};

export const SimpleCarousel = ({
  items,
  ariaLabel = "Carousel",
  className,
}: SimpleCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) {
    return null;
  }

  const move = (offset: number) => {
    setActiveIndex((current) => (current + offset + items.length) % items.length);
  };

  return (
    <section className={className} aria-label={ariaLabel}>
      <div>{items[activeIndex]}</div>
      {items.length > 1 ? (
        <div className="simple-carousel__controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous slide">
            Prev
          </button>
          <span aria-live="polite">
            {activeIndex + 1} / {items.length}
          </span>
          <button type="button" onClick={() => move(1)} aria-label="Next slide">
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
};
