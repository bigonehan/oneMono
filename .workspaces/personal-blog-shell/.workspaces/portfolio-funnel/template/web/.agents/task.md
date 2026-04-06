---
name: astro-template-structure-enhancement
description: Add Astro app template with header/body/footer structure using @ui/shadcn
owner: codex
status: done
related_plan: ./.agents/plan.md
related_change: rnxsvosy
---

# features
- [x] F1. Header/body/footer base layout in Astro template
  - objective: Match template/web/next page structure for reusable monorepo template
  - acceptance_criteria:
    - Page renders `Header`, body sections, and `Footer` in order
    - Header and Footer are imported from `@ui/shadcn`
- [x] F2. Scroll sections for template body
  - objective: Provide immediate starter body structure for landing/page composition
  - acceptance_criteria:
    - Exactly 5 sections are rendered
    - Each section fills viewport height and has distinct background color

# files
## create
- `template/web/astro/package.json`: Astro workspace package config and scripts
- `template/web/astro/astro.config.mjs`: Astro config with React integration
- `template/web/astro/tsconfig.json`: TypeScript config extending Astro strict preset
- `template/web/astro/src/pages/index.astro`: Main page with header/body/footer structure
- `template/web/astro/src/styles/global.css`: Shared layout and section styles
- `template/web/astro/README.md`: Usage instructions for Astro template

## modify
- none

## delete
- none

# rule
- Follow architecture order: `domain -> port -> adapter -> composition`.
- For UI changes, add components under `packages/ui/shadcn` and consume via `@ui/shadcn`.
- Use Jujutsu workflow: `jj new` for localized changes, `jj workspace` for structural changes.
- Do not implement code before `./.agents/task.md` is created from this template.
- Keep changes scoped to this feature document.

# implementation_steps
1. Create Astro workspace package scaffold files.
2. Add page and CSS with header/body/footer structure and 5 sections.
3. Validate package scripts and type check command.

# validation
- [x] Type check: `bun run check-types` (in `template/web/astro`)
- [x] Tests: `N/A`
- [ ] Manual checks:
  - Header, body sections, and footer render in order.
  - Five full-height sections render with distinct colors.

# done_definition
- [x] All acceptance criteria are met.
- [x] Validation commands pass.
- [x] Task document and decision notes are updated.
