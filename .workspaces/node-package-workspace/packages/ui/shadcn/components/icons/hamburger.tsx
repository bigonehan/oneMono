import type { SVGProps } from "react";

type HamburgerIconProps = SVGProps<SVGSVGElement>;

export const HamburgerIcon = (props: HamburgerIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
