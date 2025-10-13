import * as React from "react"
import { Button } from "@ui/shadcn/ui/button"
import type { ButtonProps } from "../../types/button"
import { cn } from "../../lib/utils"
import { Search } from "lucide-react"

/**
 * An icon button for search actions.
 * @param {ButtonProps} props - The props for the button component.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref for the button element.
 * @returns {JSX.Element} - The rendered button component.
 */
const SearchButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(className)}
        ref={ref}
        {...props}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    )
  }
)
SearchButton.displayName = "SearchButton"

export { SearchButton }
