import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@ui/shadcn/ui/dialog"
import { Button } from "@ui/shadcn/ui/button"

/**
 * A reusable modal window component built on top of shadcn's Dialog.
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.trigger - The element that triggers the modal.
 * @param {string} props.title - The title of the modal.
 * @param {string} [props.description] - An optional description for the modal.
 * @param {React.ReactNode} props.children - The content of the modal.
 * @param {React.ReactNode} [props.footer] - An optional footer for the modal.
 * @returns {JSX.Element} - The rendered modal window component.
 */
const ModalWindow = ({
  trigger,
  title,
  description,
  children,
  footer,
}: {
  trigger: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

export { ModalWindow }
