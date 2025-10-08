import * as React from "react"
import { Button, ButtonProps } from "@ui/shadcn/ui/button"
import { cn } from "../../lib/utils"

/**
 * A button for logging in or signing up.
 * @param {ButtonProps} props - The props for the button component.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref for the button element.
 * @returns {JSX.Element} - The rendered button component.
 */
const LoginButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "bg-brand text-white hover:bg-brand/90",
          className
        )}
        ref={ref}
        {...props}
      >
        Login / Sign Up
      </Button>
    )
  }
)
LoginButton.displayName = "LoginButton"

export { LoginButton }
