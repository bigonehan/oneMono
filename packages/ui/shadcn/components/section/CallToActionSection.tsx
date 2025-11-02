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
  id?: string;
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
  id,
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
    <SectionWrapper id={id} className="bg-primary/5 py-24">
      <div className={`max-w-3xl space-y-6 ${alignmentClasses}`}>
        {eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            {eyebrow}
          </span>
        )}
        <h2
          data-section-heading
          className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
        >
          {title}
        </h2>
        <p
          data-section-body
          className="text-lg leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
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
