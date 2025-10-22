import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@ui/shadcn/components/ui/badge";
import { Button } from "@ui/shadcn/components/ui/button";
import { SectionWrapper } from "../SectionWrapper";

interface Hero_2prop {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
}

const Hero_2 = ({
  badge = "버튼",
  heading = "메인 문구",
  description = "설명",
  buttons = {
    primary: {
      text: "버튼 선택",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "버튼 취소 ",
      url: "https://www.shadcnblocks.com",
    },
  },
  image = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "Hero section demo image showing interface components",
  },
}: Hero_2prop) => {
  return (
    <SectionWrapper
      className="py-32"
      contentClassName="grid items-center gap-8 lg:grid-cols-2"
    >
      <div
        data-anim="pane"
        className="flex flex-col items-center text-center lg:items-start lg:text-left"
      >
        {badge && (
          <Badge data-anim="pane" variant="outline">
            {badge}
            <ArrowUpRight data-anim="img" className="ml-2 size-4" />
          </Badge>
        )}
        <h1
          data-anim="title"
          className="my-6 text-pretty text-4xl font-bold lg:text-6xl"
        >
          {heading}
        </h1>
        <p
          data-anim="description"
          className="text-muted-foreground mb-8 max-w-xl lg:text-xl"
        >
          {description}
        </p>
        <div
          data-anim="pane"
          className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start"
        >
          {buttons.primary && (
            <Button data-anim="pane" asChild className="w-full sm:w-auto">
              <a href={buttons.primary.url}>{buttons.primary.text}</a>
            </Button>
          )}
          {buttons.secondary && (
            <Button
              data-anim="pane"
              asChild
              variant="outline"
              className="w-full sm:w-auto"
            >
              <a href={buttons.secondary.url}>
                {buttons.secondary.text}
                <ArrowRight data-anim="img" className="size-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
      <img
        data-anim="img"
        src={image.src}
        alt={image.alt}
        className="max-h-96 w-full rounded-md object-cover"
      />
    </SectionWrapper>
  );
};

export { Hero_2 };
