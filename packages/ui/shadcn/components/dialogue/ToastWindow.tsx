import * as React from "react"
import { Toaster, toast } from "@ui/shadcn/ui/sonner"
import { Button } from "@ui/shadcn/ui/button"

/**
 * A component that demonstrates how to use the toast notification system.
 * It renders a button to trigger a toast and the Toaster component to display toasts.
 * @returns {JSX.Element} - The rendered component.
 */
const ToastWindow = () => {
  return (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>
    </div>
  )
}

export { ToastWindow, toast }
