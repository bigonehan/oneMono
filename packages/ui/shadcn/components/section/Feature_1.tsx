import { ArrowRight } from "lucide-react";

import { Button } from "@ui/shadcn/components/ui/button";
import { SectionWrapper } from "../SectionWrapper";

interface Featureprop {
  id: string;
  heading: string;
  description: string;
  image: string;
  url: string;
}

interface Feature73prop {
  title: string;
  description?: string;
  buttonUrl?: string;
  buttonText?: string;
  features?: Featureprop[];
}

const featuresExample: Featureprop[] = [
    {
      id: "feature-1",
      heading: "Modern Design",
      description:
        "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
      url: "https://shadcnblocks.com",
    },
    {
      id: "feature-2",
      heading: "Responsive Layout",
      description:
        "Fully responsive design that works seamlessly across all devices and screen sizes. Perfect for any platform.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
      url: "https://shadcnblocks.com",
    },
    {
      id: "feature-3",
      heading: "Easy Integration",
      description:
        "Simple integration process with comprehensive documentation and dedicated support team.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
      url: "https://shadcnblocks.com",
    },
  ];

const Feature73 = ({
  title = "Key Features",
  description = "Discover the powerful features that make our platform stand out from the rest. Built with the latest technology and designed for maximum productivity.",
  buttonUrl = "https://shadcnblocks.com",
  buttonText = "Book a demo",
  features = featuresExample,
}: Feature73prop) => {
  return (
    <SectionWrapper
      className="py-32"
      contentClassName="space-y-12"
    >
      <div data-anim="pane" className="lg:max-w-sm">
        <h2
          data-anim="title"
          className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6"
        >
          {title}
        </h2>
        {description && (
          <p
            data-anim="description"
            className="text-muted-foreground mb-8 lg:text-lg"
          >
            {description}
          </p>
        )}
        {buttonUrl && (
          <Button data-anim="pane" variant="link" asChild>
            <a
              href={buttonUrl}
              className="group flex items-center font-medium md:text-base lg:text-lg"
            >
              {buttonText}
              <ArrowRight data-anim="img" />
            </a>
          </Button>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {features.map((feature) => (
          <div
            key={feature.id}
            data-anim="pane"
            className="border-border flex flex-col overflow-clip rounded-xl border"
          >
            <a href={feature.url}>
              <img
                data-anim="img"
                src={feature.image}
                alt={feature.heading}
                className="aspect-16/9 h-full w-full object-cover object-center transition-opacity hover:opacity-80"
              />
            </a>
            <div className="px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
              <h3
                data-anim="title"
                className="mb-3 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6"
              >
                {feature.heading}
              </h3>
              <p
                data-anim="description"
                className="text-muted-foreground lg:text-lg"
              >
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export { Feature73 };
