import { ArrowUpRight } from "lucide-react";

import { Badge } from "@ui/shadcn/components/ui/badge";
import { Button } from "@ui/shadcn/components/ui/button";

export type ChangelogEntryprop = {
  version: string;
  date: string;
  title: string;
  description: string;
  items?: string[];
  image?: string;
  button?: {
    url: string;
    text: string;
  };
};

export interface Changelog1prop {
  title?: string;
  description?: string;
  entries?: ChangelogEntryprop[];
  className?: string;
}

export const defaultEntriesExample: ChangelogEntryprop[] = [
  {
    version: "Version 1.3.0",
    date: "15 November 2024",
    title: "Enhanced Analytics Dashboard",
    description:
      "We've completely redesigned our analytics dashboard to provide deeper insights and improved visualizations of your data.",
    items: [
      "Interactive data visualizations with real-time updates",
      "Customizable dashboard widgets",
      "Export analytics in multiple formats (CSV, PDF, Excel)",
      "New reporting templates for common use cases",
      "Improved data filtering and segmentation options",
    ],
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-aspect-video-1.svg",
    button: {
      url: "https://shadcnblocks.com",
      text: "Learn more",
    },
  },
  {
    version: "Version 1.2.5",
    date: "7 October 2024",
    title: "Mobile App Launch",
    description:
      "We're excited to announce the launch of our mobile application, available now on iOS and Android platforms.",
    items: [
      "Native mobile experience for on-the-go productivity",
      "Offline mode support for working without internet connection",
      "Push notifications for important updates",
      "Biometric authentication for enhanced security",
    ],
  },
  {
    version: "Version 1.2.1",
    date: "23 September 2024",
    title: "New features and improvements",
    description:
      "Here are the latest updates and improvements to our platform. We are always working to improve our platform and your experience.",
    items: [
      "Added new feature to export data",
      "Improved performance and speed",
      "Fixed minor bugs and issues",
      "Added new feature to import data",
    ],
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-aspect-video-1.svg",
  },
  {
    version: "Version 1.0.0",
    date: "31 August 2024",
    title: "First version of our platform",
    description:
      "Introducing a new platform to help you manage your projects and tasks. We are excited to launch our platform and help you get started. We are always working to improve our platform and your experience.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-aspect-video-1.svg",
    button: {
      url: "https://shadcnblocks.com",
      text: "Learn more",
    },
  },
];

const Changelog_1 = ({
  title = "Changelog",
  description = "Get the latest updates and improvements to our platform.",
  entries = defaultEntriesExample,
}: Changelog1prop) => {
  return (
    <section data-anim="pane" className="py-32">
      <div data-anim="pane" className="container">
        <div data-anim="pane" className="mx-auto max-w-3xl">
          <h1
            data-anim="title"
            className="mb-4 text-3xl font-bold tracking-tight md:text-5xl"
          >
            {title}
          </h1>
          <p
            data-anim="description"
            className="text-muted-foreground mb-6 text-base md:text-lg"
          >
            {description}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-3xl space-y-16 md:mt-24 md:space-y-24">
          {entries.map((entry, index) => (
            <div
              key={index}
              data-anim="pane"
              className="relative flex flex-col gap-4 md:flex-row md:gap-16"
            >
              <div className="top-8 flex h-min w-64 shrink-0 items-center gap-4 md:sticky">
                <Badge data-anim="pane" variant="secondary" className="text-xs">
                  {entry.version}
                </Badge>
                <span
                  data-anim="description"
                  className="text-muted-foreground text-xs font-medium"
                >
                  {entry.date}
                </span>
              </div>
              <div data-anim="pane" className="flex flex-col">
                <h2
                  data-anim="title"
                  className="text-foreground/90 mb-3 text-lg font-bold leading-tight md:text-2xl"
                >
                  {entry.title}
                </h2>
                <p
                  data-anim="description"
                  className="text-muted-foreground text-sm md:text-base"
                >
                  {entry.description}
                </p>
                {entry.items && entry.items.length > 0 && (
                  <ul className="text-muted-foreground ml-4 mt-4 space-y-1.5 text-sm md:text-base">
                    {entry.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        data-anim="description"
                        className="list-disc"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {entry.image && (
                  <img
                    data-anim="img"
                    src={entry.image}
                    alt={`${entry.version} visual`}
                    className="mt-8 w-full rounded-lg object-cover"
                  />
                )}
                {entry.button && (
                  <Button
                    data-anim="pane"
                    variant="link"
                    className="mt-4 self-end"
                    asChild
                  >
                    <a href={entry.button.url} target="_blank" rel="noreferrer">
                      {entry.button.text}{" "}
                      <ArrowUpRight data-anim="img" className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Changelog_1 };
