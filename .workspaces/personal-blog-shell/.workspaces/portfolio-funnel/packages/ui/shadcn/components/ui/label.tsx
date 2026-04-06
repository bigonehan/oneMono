"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type LabelElement = HTMLLabelElement;
type LabelProps = React.LabelHTMLAttributes<LabelElement> &
  VariantProps<typeof labelVariants>;

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const cn = (...inputs: Array<string | false | null | undefined>) =>
  twMerge(clsx(inputs));

export const Label = forwardRef<LabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn(labelVariants(), className)} {...props} /> 

  )
);

Label.displayName = "Label";
