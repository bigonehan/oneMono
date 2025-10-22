import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ui/shadcn/components/ui/sheet"
import { Button } from "@ui/shadcn/components/ui/button"
import { Menu } from "lucide-react"
import { SectionWrapper } from "../SectionWrapper"

/**
 * A sidebar component that uses a sheet to display navigation links.
 * @returns {JSX.Element} - The rendered sidebar component.
 */
const Sidebar = () => {
  return (
    <SectionWrapper contentClassName="flex justify-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button data-anim="pane" variant="outline" size="icon">
            <Menu data-anim="img" className="h-4 w-4" />
            <span className="sr-only">Open Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent data-anim="pane" side="left">
          <SheetHeader>
            <SheetTitle data-anim="title">Menu</SheetTitle>
          </SheetHeader>
          <div data-anim="pane" className="grid gap-4 py-4">
            <a data-anim="description" href="/" className="py-2">Home</a>
            <a data-anim="description" href="/features" className="py-2">Features</a>
            <a data-anim="description" href="/pricing" className="py-2">Pricing</a>
            <a data-anim="description" href="/about" className="py-2">About</a>
          </div>
        </SheetContent>
      </Sheet>
    </SectionWrapper>
  )
}

export { Sidebar }
