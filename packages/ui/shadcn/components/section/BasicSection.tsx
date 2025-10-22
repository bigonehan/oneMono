import { cn } from "@ui/shadcn/utils";

type BasicSectionProps = {
  title: string;
  description: string;
  /** Tailwind utility classes or custom tokens controlling the section background. */
  color: string;
  className?: string;
};

/**
 * Simple content section used to validate scroll-triggered animation behaviour.
 */
export const BasicSection = ({
  title,
  description,
  color,
  className,
}: BasicSectionProps) => {
  return (
    <section
      data-anim="pane"
      data-scroll-anim="showFromZeroAlpha"
      className={cn(
        "box-border flex min-h-screen w-full flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 transition-colors",
        color,
        className,
      )}
    >
      <div data-anim="pane" className="mx-auto flex max-w-4xl flex-col gap-4">
        <h2
          data-anim="title"
          className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          {title}
        </h2>
        <p
          data-anim="description"
          className="text-lg leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
      </div>
    </section>
  );
};
