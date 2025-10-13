import * as React from "react"
import { Button } from "@ui/shadcn/ui/button"
import type { ButtonProps } from "../../types/button"
import { cn } from "../../lib/utils"

/**
 * A button for canceling an action. Uses the "destructive" variant.
 * @param {ButtonProps} props - The props for the button component.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref for the button element.
 * @returns {JSX.Element} - The rendered button component.
 */
const CancelButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        variant="destructive"
        className={cn(className)}
        ref={ref}
        {...props}
      >
        Cancel
      </Button>
    )
  }
)
CancelButton.displayName = "CancelButton"

export { CancelButton }
