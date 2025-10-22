import type { ReactNode } from "react";

import { SectionWrapper } from "../SectionWrapper";

interface Hero_1prop {
  header: ReactNode;
  subheader: ReactNode;
  description?: ReactNode;
  ctaButton?: ReactNode; // optional - 커스텀 버튼 가능
  ctaText?: string;
  ctaLink?: string;
  image?: string;
  heroImage?: ReactNode; // optional - 커스텀 이미지 가능
}

export function Hero_1({
  header,
  subheader,
  description,
  ctaButton,
  heroImage,
}: Hero_1prop) {
  return (
    <SectionWrapper
      className="lg:py-20"
      contentClassName="flex flex-col gap-4 text-center lg:items-center lg:gap-8"
    >
      <div
        data-anim="pane"
        className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8"
      >
        <div className="space-y-4">
          <h1 data-anim="title" className="text-4xl font-bold lg:text-6xl">
            {header}
          </h1>
          <h2
            data-anim="description"
            className="text-lg font-light text-muted-foreground lg:text-3xl"
          >
            {subheader}
          </h2>
          {description && (
            <p
              data-anim="description"
              className="text-base text-muted-foreground lg:text-xl"
            >
              {description}
            </p>
          )}
        </div>
        {ctaButton && <div data-anim="pane">{ctaButton}</div>}
      </div>
      {heroImage && (
        <div
          data-anim="img"
          className="flex flex-1 justify-center lg:justify-end"
        >
          {heroImage}
        </div>
      )}
    </SectionWrapper>
  );
}
