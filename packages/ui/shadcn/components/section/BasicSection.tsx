import { cn } from "@ui/shadcn/utils";

type BasicSectionProps = {
  id?: string;
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
  id,
  title,
  description,
  color,
  className,
}: BasicSectionProps) => {
  return (
    <section
      id={id}
      data-scroll-anim="showFromZeroAlpha"
      className={cn(
        "box-border flex min-h-screen w-full flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 transition-colors",
        color,
        className,
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <h2
          data-section-heading
          className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          {title}
        </h2>
        <p
          data-section-body
          className="text-lg leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
      </div>
    </section>
  );
};
