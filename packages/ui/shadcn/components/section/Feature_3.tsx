import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/shadcn/components/ui/card"
import { Rocket, Zap, Shield } from "lucide-react"
import { SectionWrapper } from "../SectionWrapper"

const featuresContent = [
  {
    icon: <Rocket className="h-8 w-8" />,
    title: "Fast & Reliable",
    description: "Our service is blazing fast and always available.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Easy to Use",
    description: "A simple and intuitive interface to get things done.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure",
    description: "Your data is safe with our top-tier security.",
  },
]

/**
 * A section that displays a grid of features with icons, titles, and descriptions.
 * @returns {JSX.Element} - The rendered feature section component.
 */
const Feature_3 = ({ id }: { id?: string }) => {
  return (
    <SectionWrapper id={id} className="py-20" contentClassName="space-y-12">
      <div className="text-center space-y-2">
        <h2 data-section-heading className="text-3xl font-bold">
          Features
        </h2>
        <p data-section-body className="text-muted-foreground">
          Discover what makes our product unique.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {featuresContent.map((feature, index) => (
          <Card key={index}>
            <CardHeader className="items-center">
              {feature.icon}
              <CardTitle data-section-heading>
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p data-section-body>
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}

export { Feature_3 }
