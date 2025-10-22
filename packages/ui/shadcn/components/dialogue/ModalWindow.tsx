import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@ui/shadcn/components/ui/dialog"
import { SectionWrapper } from "../SectionWrapper"


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
interface ModalWindowprop {
  trigger: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

const ModalWindow = ({
  trigger,
  title,
  description,
  children,
  footer,
}: ModalWindowprop) => {
  return (
    <SectionWrapper contentClassName="flex justify-center">
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent data-anim="pane">
          <DialogHeader>
            <DialogTitle data-anim="title">{title}</DialogTitle>
            {description && (
              <DialogDescription data-anim="description">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          {children}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  )
}

export { ModalWindow }
