import type { TweenVars } from "gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

type FromOrToMethod = "from" | "to";

export type TimelineStep =
  | {
      selector: string;
      method?: FromOrToMethod;
      vars: TweenVars;
      position?: string | number;
    }
  | {
      selector: string;
      method: "fromTo";
      fromVars: TweenVars;
      toVars: TweenVars;
      position?: string | number;
    };

export interface TimelineConfig {
  defaults?: TweenVars;
  trigger?: Partial<ScrollTrigger.Vars>;
  steps: TimelineStep[];
}

export interface SectionAnimationConfig {
  id: string;
  timelines: TimelineConfig[];
}

const defaultTrigger: Partial<ScrollTrigger.Vars> = {
  start: "top 80%",
  end: "bottom top",
  toggleActions: "play none none reverse",
};

export const sectionAnimations: SectionAnimationConfig[] = [
  {
    id: "section-1",
    timelines: [
      {
        trigger: defaultTrigger,
        steps: [
          {
            selector: "[data-section-heading]",
            vars: {
              opacity: 0,
              x: -200,
              rotation: -10,
            },
          },
          {
            selector: "[data-section-body]",
            vars: {
              opacity: 0,
              x: -100,
            },
            position: "-=0.2",
          },
        ],
      },
    ],
  },
  {
    id: "section-2",
    timelines: [
      {
        trigger: {
          ...defaultTrigger,
          toggleActions: "play none none none",
        },
        steps: [
          {
            selector: "[data-section-heading]",
            vars: {
              opacity: 0,
              scale: 0,
              rotation: 360,
              duration: 1.5,
            },
          },
          {
            selector: "[data-section-body]",
            vars: {
              opacity: 0,
              scale: 0.5,
              x: 50,
            },
            position: "-=0.2",
          },
        ],
      },
      {
        trigger: {
          start: "top center",
          end: "bottom center",
          scrub: 1,
          pin: true,
        },
        steps: [
          {
            selector: "[data-section-heading]",
            vars: {
              opacity: 0,
              scale: 0.5,
              rotation: 180,
            },
          },
          {
            selector: "[data-section-body]",
            vars: {
              opacity: 0,
              x: 100,
            },
            position: "-=0.3",
          },
        ],
      },
    ],
  },
  {
    id: "section-3",
    timelines: [
      {
        trigger: defaultTrigger,
        steps: [
          {
            selector: "[data-section-heading]",
            vars: {
              opacity: 0,
              y: 80,
            },
          },
          {
            selector: "[data-section-body]",
            vars: {
              opacity: 0,
              y: 40,
            },
            position: "-=0.15",
          },
        ],
      },
    ],
  },
];
