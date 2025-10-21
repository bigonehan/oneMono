# Task: Align Landing Content with `.ai/content.md`

- Re-verify each section described in `.ai/content.md` and ensure a matching UI block exists.
- Create or refine reusable components in `packages/ui/shadcn` when gaps are found (e.g. feature list, evidence block).
- Populate `app/gapyear/app/page.tsx` with the correct content using those components so copy and structure mirror the content document.

## Plan

1. Audit the existing page vs. `.ai/content.md` to list mismatches or missing presentation requirements.
2. Implement or adjust shared components to cover the needed layouts (feature grid/table, evidence notes, etc.).
3. Update page data/content files to feed these components with the documented copy and visuals, then run lint checks.
