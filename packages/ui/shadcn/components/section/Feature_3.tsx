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
    icon: <Rocket data-anim="img" className="h-8 w-8" />,
    title: "Fast & Reliable",
    description: "Our service is blazing fast and always available.",
  },
  {
    icon: <Zap data-anim="img" className="h-8 w-8" />,
    title: "Easy to Use",
    description: "A simple and intuitive interface to get things done.",
  },
  {
    icon: <Shield data-anim="img" className="h-8 w-8" />,
    title: "Secure",
    description: "Your data is safe with our top-tier security.",
  },
]

/**
 * A section that displays a grid of features with icons, titles, and descriptions.
 * @returns {JSX.Element} - The rendered feature section component.
 */
const Feature_3 = () => {
  return (
    <SectionWrapper className="py-20" contentClassName="space-y-12">
      <div data-anim="pane" className="text-center space-y-2">
        <h2 data-anim="title" className="text-3xl font-bold">
          Features
        </h2>
        <p data-anim="description" className="text-muted-foreground">
          Discover what makes our product unique.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {featuresContent.map((feature, index) => (
          <Card key={index} data-anim="pane">
            <CardHeader data-anim="pane" className="items-center">
              {feature.icon}
              <CardTitle data-anim="title">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent data-anim="pane" className="text-center">
              <p data-anim="description">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}

export { Feature_3 }
