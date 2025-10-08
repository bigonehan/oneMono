import * as React from "react"
import { Button, ButtonProps } from "@ui/shadcn/ui/button"
import { cn } from "../../lib/utils"

/**
 * A primary button for subject actions.
 * @param {ButtonProps} props - The props for the button component.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref for the button element.
 * @returns {JSX.Element} - The rendered button component.
 */
const SubjectButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "bg-primary text-primary-foreground hover:bg-primary/90",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
SubjectButton.displayName = "SubjectButton"

export { SubjectButton }
