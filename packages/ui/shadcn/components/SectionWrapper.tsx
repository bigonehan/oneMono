import type { ReactNode } from "react";
import { cn } from "@ui/shadcn/utils";

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

const SectionWrapper = ({
  id,
  children,
  className,
  contentClassName,
}: SectionWrapperProps) => {
  return (
    <section
      id={id}
      data-anim="pane"
      className={cn(
        "py-16 px-4 sm:px-3 lg:px-8 bg-background text-foreground transition-colors",
        className,
      )}
    >

      <div className={cn("max-w-7xl mx-auto", contentClassName)}>{children}</div>
    </section>
  );
};

export { SectionWrapper };
