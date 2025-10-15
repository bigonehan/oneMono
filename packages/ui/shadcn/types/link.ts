import { ComponentType, ReactNode } from "react";

export type LinkComponent = ComponentType<{
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}>;
