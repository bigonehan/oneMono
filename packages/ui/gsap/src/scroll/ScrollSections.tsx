'use client';

import type { CSSProperties, PropsWithChildren } from 'react';

import { useScrollSections, type UseScrollSectionsOptions } from './useScrollSections';

export type ScrollSectionContainerProps = PropsWithChildren<
  UseScrollSectionsOptions & {
    className?: string;
    style?: CSSProperties;
  }
>;

/**
 * Wrap landing page sections with this component to enable snap-scrolling behaviour.
 * Each descendant section can optionally set `data-scroll-anim="<preset>"`
 * to pick a registry animation that runs on entry.
 */
export const ScrollSections = ({
  children,
  className,
  style,
  ...options
}: ScrollSectionContainerProps) => {
  const { containerRef } = useScrollSections(options);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
};
