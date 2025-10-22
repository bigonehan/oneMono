import * as React from "react"
import { Toaster } from "@ui/shadcn/components/ui/sonner"
import { toast } from "sonner"
import { Button } from "@ui/shadcn/components/ui/button"
import { SectionWrapper } from "../SectionWrapper"

/**
 * A component that demonstrates how to use the toast notification system.
 * It renders a button to trigger a toast and the Toaster component to display toasts.
 * @returns {JSX.Element} - The rendered component.
 */
const ToastWindow = () => {
  return (
    <SectionWrapper contentClassName="space-y-4">
      <Toaster />
      <Button
        data-anim="pane"
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
    </SectionWrapper>
  )
}

export { ToastWindow, toast }
