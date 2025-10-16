export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
}
