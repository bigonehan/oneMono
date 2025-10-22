import type { ReactNode } from "react";

import { SectionWrapper } from "../SectionWrapper";

interface HighlightItem {
  icon?: ReactNode;
  title: string;
  description?: string;
}

interface InformationalSectionProps {
  eyebrow?: string;
  title: string;
  description: string | string[];
  highlights?: HighlightItem[];
  align?: "center" | "start";
  footer?: ReactNode;
}

/**
 * InformationalSection renders copy-heavy sections with optional highlight rows.
 * Useful for problem framing, scientific backing, or app introductions.
 */
export function InformationalSection({
  eyebrow,
  title,
  description,
  highlights = [],
  align = "center",
  footer,
}: InformationalSectionProps) {
  const descriptions = Array.isArray(description)
    ? description
    : [description];

  const isCentered = align === "center";

  return (
    <SectionWrapper
      contentClassName={`max-w-4xl ${isCentered ? "text-center mx-auto space-y-8" : "space-y-8"}`}
    >
      <div
        data-anim="pane"
        className={`space-y-4 ${isCentered ? "" : "text-left"}`}
      >
        {eyebrow && (
          <span
            data-anim="description"
            className="text-sm font-semibold uppercase tracking-wide text-primary"
          >
            {eyebrow}
          </span>
        )}
        <h2
          data-anim="title"
          className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
        >
          {title}
        </h2>
        <div className="space-y-3 text-lg leading-relaxed text-muted-foreground">
          {descriptions.map((paragraph, index) => (
            <p key={index} data-anim="description">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {highlights.length > 0 && (
        <div
          className={`grid gap-6 ${isCentered ? "md:grid-cols-3" : "md:grid-cols-2"}`}
        >
          {highlights.map((item, index) => (
            <div
              key={index}
              data-anim="pane"
              className="rounded-lg border border-border/60 bg-muted/30 p-6 text-left shadow-sm"
            >
              {item.icon && (
                <div
                  data-anim="img"
                  className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  {item.icon}
                </div>
              )}
              <h3 data-anim="title" className="text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              {item.description && (
                <p
                  data-anim="description"
                  className="mt-2 text-sm text-muted-foreground"
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {footer}
    </SectionWrapper>
  );
}
