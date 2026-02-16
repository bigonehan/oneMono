---
name: next-template-structure-enhancement
description: Add header/body/footer structure with smooth scroll sections using @ui/shadcn components
owner: codex
status: in-progress
related_plan: ./.agents/plan.md
related_change: zykwzxkq
---

# features
- [ ] F1. Header with mobile hamburger and navigation items
  - objective: Provide baseline top navigation in template
  - acceptance_criteria:
    - Header includes hamburger icon button for mobile
    - Header includes Blog and Profile menu items
- [ ] F2. Body sections with smooth scroll
  - objective: Provide full-page section-based landing template
  - acceptance_criteria:
    - Exactly 5 sections rendered
    - Each section fills viewport height
    - Each section uses a distinct background color
    - Lenis is enabled for smooth scrolling
- [ ] F3. Footer with centered SNS icons
  - objective: Provide reusable simple social footer area
  - acceptance_criteria:
    - Footer places SNS icons at center horizontally and vertically

# files
## create
- `packages/ui/shadcn/components/layout/header.tsx`: Header component with hamburger and nav items
- `packages/ui/shadcn/components/layout/footer.tsx`: Footer component with centered SNS icons
- `packages/ui/shadcn/components/icons/hamburger.tsx`: Reusable hamburger icon component

## modify
- `packages/ui/shadcn/src/index.ts`: Export newly added components
- `template/web/next/package.json`: Add lenis dependency
- `template/web/next/app/page.tsx`: Apply header/body/footer structure and 5 sections
- `template/web/next/app/globals.css`: Add layout/section/footer styles

## delete
- none

# rule
- Follow architecture order: `domain -> port -> adapter -> composition`.
- For UI changes, add components under `packages/ui/shadcn` and consume via `@ui/shadcn`.
- Use Jujutsu workflow: `jj new` for localized changes, `jj workspace` for structural changes.
- Do not implement code before `./.agents/task.md` is created from this template.
- Keep changes scoped to this feature document.

# implementation_steps
1. Check existing `@ui/shadcn` components and identify missing ones.
2. Add missing header/footer/icon components to `packages/ui/shadcn` and export them.
3. Update template app page and styles to satisfy requested structure.
4. Add Lenis dependency and initialize smooth scrolling in page runtime.
5. Run type checks to validate integration.

# validation
- [ ] Type check: `bun run check-types`
- [ ] Tests: `N/A`
- [ ] Manual checks:
  - Header renders mobile hamburger icon and Blog/Profile menu.
  - Five full-screen color sections render and scroll smoothly.
  - Footer SNS icons are centered.

# done_definition
- [ ] All acceptance criteria are met.
- [ ] Validation commands pass.
- [ ] Task document and decision notes are updated.
