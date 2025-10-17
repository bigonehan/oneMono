import type { VariantProps } from "class-variance-authority"
import type { buttonVariants } from  "../components/ui/button"

export interface Buttonprop
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
