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

/**
 * A sidebar component that uses a sheet to display navigation links.
 * @returns {JSX.Element} - The rendered sidebar component.
 */
const Sidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <a href="/" className="py-2">Home</a>
          <a href="/features" className="py-2">Features</a>
          <a href="/pricing" className="py-2">Pricing</a>
          <a href="/about" className="py-2">About</a>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { Sidebar }
