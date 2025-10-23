# Gapyear Landing Page Structure

## Section Overview
- **Hero** · component `@ui/shadcn/hero/hero_1` · copy from `.ai/content.md` → `heroContent` in `@src/content/landingSections.ts`
- **Problem Awareness** · component `@ui/shadcn/section/InformationalSection` (centered) · descriptive paragraphs from `.ai/content.md`
- **Core Features** · component `@ui/shadcn/section/FeatureListSection` · data from `FeatureList` (`@src/content/FeatureContent.tsx`)
- **Scientific Proof** · component `@ui/shadcn/section/InformationalSection` with highlight cards · data from `scientificProofContent`
- **Testimonials** · component `@ui/shadcn/section/Testimonial_1` · data from `testimonials`
- **App Highlights** · component `@ui/shadcn/section/InformationalSection` with highlights · data from `appHighlightsContent`
- **Final CTA** · component `@ui/shadcn/section/CallToActionSection` · data from `finalCtaContent`

## Content Sources
- Primary messaging lives in `.ai/content.md`; mirror into `@src/content/landingSections.ts` and `FeatureContent.tsx`.
- Media assets (e.g., hero illustration) are served from `public/`.

## Component Responsibilities
- Keep UI logic inside `@ui/shadcn` components; pass data objects from `@src/content`.
- Export any new shared components through `packages/ui/shadcn/components`.

## Implementation Notes
- Landing page entry: `app/page.tsx`.
- Maintain semantic section ordering to match overview above.
- CTA buttons should use `@ui/shadcn/ui/button` with `Link`.
