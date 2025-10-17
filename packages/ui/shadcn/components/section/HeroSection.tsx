import * as React from "react"
import { Button } from "@ui/shadcn/components/ui/button"

/**
 * A hero section component with a title, tagline, and call-to-action buttons.
 * @returns {JSX.Element} - The rendered hero section component.
 */
const HeroSection = () => {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-bold">Your Awesome Product</h1>
      <p className="text-lg text-muted-foreground mt-4">
        A catchy tagline about what makes your product great.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </div>
    </section>
  )
}

export { HeroSection }
