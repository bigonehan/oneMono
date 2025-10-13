import * as React from "react"
import { Button } from "@ui/shadcn/ui/button"
import type { ButtonProps } from "../../types/button"
import { cn } from "../../lib/utils"
import { Bell } from "lucide-react"

/**
 * An icon button for notification actions.
 * @param {ButtonProps} props - The props for the button component.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref for the button element.
 * @returns {JSX.Element} - The rendered button component.
 */
const NotificationButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(className)}
        ref={ref}
        {...props}
      >
        <Bell className="h-4 w-4" />
        <span className="sr-only">Notifications</span>
      </Button>
    )
  }
)
NotificationButton.displayName = "NotificationButton"

export { NotificationButton }
