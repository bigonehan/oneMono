import type { ReactNode } from "react";

import { Button } from "@ui/shadcn/components/ui/button";

import { SectionWrapper } from "../SectionWrapper";

interface CTAButton {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline";
  icon?: ReactNode;
}

interface CallToActionSectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction: CTAButton;
  secondaryAction?: CTAButton;
  align?: "center" | "start";
}

/**
 * CallToActionSection renders a focused CTA block with optional secondary action.
 */
export function CallToActionSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  align = "center",
}: CallToActionSectionProps) {
  const alignmentClasses =
    align === "center"
      ? "text-center mx-auto flex flex-col items-center"
      : "text-left";

  return (
    <SectionWrapper className="bg-primary/5 py-24">
      <div
        data-anim="pane"
        className={`max-w-3xl space-y-6 ${alignmentClasses}`}
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
        <p
          data-anim="description"
          className="text-lg leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
        <div data-anim="pane" className="flex flex-col gap-3 sm:flex-row">
          <Button data-anim="pane" asChild size="lg">
            <a
              href={primaryAction.href}
              className="inline-flex items-center gap-2"
            >
              {primaryAction.label}
              {primaryAction.icon}
            </a>
          </Button>
          {secondaryAction && (
            <Button
              data-anim="pane"
              asChild
              size="lg"
              variant={secondaryAction.variant ?? "outline"}
            >
              <a
                href={secondaryAction.href}
                className="inline-flex items-center gap-2"
              >
                {secondaryAction.label}
                {secondaryAction.icon}
              </a>
            </Button>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
