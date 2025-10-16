import { ComponentType, ReactNode } from "react";

export type Link = ComponentType<{
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}>;

