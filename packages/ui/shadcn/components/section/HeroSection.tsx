import * as React from "react"
import { Button } from "@ui/shadcn/components/ui/button"
import { SectionWrapper } from "../SectionWrapper"

/**
 * A hero section component with a title, tagline, and call-to-action buttons.
 * @returns {JSX.Element} - The rendered hero section component.
 */
const HeroSection = () => {
  return (
    <SectionWrapper className="py-20" contentClassName="text-center space-y-8">
      <React.Fragment>
        <h1 className="text-4xl font-bold">Your Awesome Product</h1>
        <p className="text-lg text-muted-foreground">
          A catchy tagline about what makes your product great.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </React.Fragment>
    </SectionWrapper>
  )
}

export { HeroSection }
