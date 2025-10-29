import type { ReactNode } from "react";

import { SectionWrapper } from "../SectionWrapper";

export interface FeatureListItem {
  id: string;
  icon?: ReactNode;
  title: string;
  description: string;
}

interface FeatureListSectionProps {
  eyebrow?: string;
  title: string;
  description?: string | string[];
  features: FeatureListItem[];
  columns?: 2 | 3;
}

/**
 * FeatureListSection renders icon + description cards in a responsive grid.
 * Suitable for listing key capabilities without interactive tabs.
 */
export function FeatureListSection({
  eyebrow,
  title,
  description,
  features,
  columns = 3,
}: FeatureListSectionProps) {
  const descriptions = Array.isArray(description)
    ? description
    : description
      ? [description]
      : [];

  const gridCols =
    columns === 2
      ? "md:grid-cols-2"
      : "md:grid-cols-2 xl:grid-cols-3";

  return (
    <SectionWrapper>
      <div data-anim="pane" className="mx-auto flex max-w-6xl flex-col gap-10">
        <div data-anim="pane" className="space-y-4 text-center">
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
          {descriptions.length > 0 && (
            <div className="space-y-3 text-muted-foreground">
              {descriptions.map((para, index) => (
                <p
                  key={index}
                  data-anim="description"
                  className="text-lg leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className={`grid gap-6 ${gridCols}`}>
          {features.map((feature) => (
            <div
              key={feature.id}
              data-anim="pane"
              className="rounded-xl border border-border/60 bg-card text-card-foreground p-6 text-left shadow-sm transition-colors supports-[backdrop-filter]:bg-card/80 supports-[backdrop-filter]:backdrop-blur"
            >
              {feature.icon && (
                <div
                  data-anim="img"
                  className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary dark:bg-primary/20"
                >
                  {feature.icon}
                </div>
              )}
              <h3 data-anim="title" className="text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p
                data-anim="description"
                className="mt-3 text-base leading-relaxed text-muted-foreground"
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
