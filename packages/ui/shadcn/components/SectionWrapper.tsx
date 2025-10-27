import type { ReactNode } from "react";
import { cn } from "@ui/shadcn/utils";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

const SectionWrapper = ({
  children,
  className,
  contentClassName,
}: SectionWrapperProps) => {
  return (
    <section
      data-anim="pane"
      className={cn(
        "py-16 px-4 sm:px-3 lg:px-8 bg-red-100 transition-colors dark:bg-neutral-950",
        className,
      )}
    >

      <div className={cn("max-w-7xl mx-auto", contentClassName)}>{children}</div>
    </section>
  );
};

export { SectionWrapper };
