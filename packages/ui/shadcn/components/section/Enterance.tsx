import { Button } from "@ui/shadcn/components/ui/button";
import { cn } from "@ui/shadcn/utils";

type EnteranceProps = {
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  className?: string;
};

/**
 * Minimal hero-style section with heading, copy, and primary action.
 * Designed to pair with scroll-triggered animations registered via GSAP presets.
 */
export const Enterance = ({
  title,
  description,
  buttonLabel,
  onButtonClick,
  className,
}: EnteranceProps) => {
  return (
    <section
      data-anim="pane"
      data-scroll-anim="showFromZeroAlpha"
      className={cn(
        "flex flex-col items-center justify-center gap-6 py-24 px-4 text-center sm:px-6 lg:px-8",
        "bg-background transition-colors dark:bg-neutral-950",
        className,
      )}
    >
      <div
        data-anim="pane"
        className="mx-auto flex max-w-4xl flex-col items-center gap-6"
      >
        <div className="space-y-4">
          <h1
            data-anim="title"
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            {title}
          </h1>
          <p
            data-anim="description"
            className="text-lg leading-relaxed text-muted-foreground"
          >
            {description}
          </p>
        </div>
        <Button data-anim="button" size="lg" onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
};
