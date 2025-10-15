import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/shadcn/ui/card"
import { Rocket, Zap, Shield } from "lucide-react"

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
const Feature_3 = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold">Features</h2>
        <p className="text-muted-foreground mt-2">
          Discover what makes our product unique.
        </p>
      </div>
      <div className="container mx-auto mt-12 grid gap-8 md:grid-cols-3">
        {featuresContent.map((feature, index) => (
          <Card key={index}>
            <CardHeader className="items-center">
              {feature.icon}
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export { Feature_3 }
