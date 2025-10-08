import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

/**
 * A loading spinner component that uses the Loader2 icon from lucide-react and a spin animation.
 * @param {object} props - The props for the component.
 * @param {string} [props.className] - Optional class name for the spinner.
 * @returns {JSX.Element} - The rendered loading spinner component.
 */
const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <Loader2 className={cn("animate-spin", className)} />
  )
}

export { LoadingSpinner }
