import { Button } from "@ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/shadcn/ui/card";

import { Check } from "lucide-react";

export type LinkComponent = ComponentType<{
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}>;
export interface PricingData {
  title: string;
  description?: string;
  plans: PricingPlan[];
}
interface PricingProps {
  data: PricingData;
  Link: LinkComponent; // Accept Link as prop
}
export function Pricing({
  data = { title: "", plans: [] },
  Link,
}: PricingProps) {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl">
            {data?.title}
          </h2>
          {data?.description && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
              {data?.description}
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {data.plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col border-border/50 ${
                plan.highlighted
                  ? "border-accent shadow-lg shadow-accent/20"
                  : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </div>
                  {plan.period && (
                    <div className="text-sm text-muted-foreground">
                      {plan.period}
                    </div>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-sm text-foreground"
                    >
                      <Check className="h-5 w-5 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href={plan.ctaHref}>{plan.ctaText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
