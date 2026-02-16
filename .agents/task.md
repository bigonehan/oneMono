---
name: move-root-domains-to-packages
description: Move root domains directory into packages/domains for monorepo consistency
owner: codex
status: done
related_plan: ./.agents/plan.md
related_change: knzswpmt
---

# features
- [x] F1. Move root `domains` content into `packages/domains`
  - objective: eliminate duplicated domain roots
  - acceptance_criteria:
    - `domains/` no longer exists at repo root
    - previous `domains/AGENTS.md` exists at `packages/domains/AGENTS.md`
- [x] F2. Update moved guide path references
  - objective: avoid stale instructions pointing to old root path
  - acceptance_criteria:
    - moved AGENTS guide references `packages/domains/*` paths

# files
## create
- `.agents/task.md`: task execution source of truth

## modify
- `packages/domains/AGENTS.md`: update path conventions after move

## delete
- `domains/AGENTS.md`: removed by move
- `packages/domains/.gitkeep`: removed if no longer needed

# rule
- Follow architecture order: `domain -> port -> adapter -> composition`.
- Use Jujutsu workflow: `jj workspace` for this structural change.
- Do not implement code before `./.agents/task.md` is created from template.
- Keep changes scoped to this feature document.

# implementation_steps
1. Move root `domains` contents to `packages/domains`.
2. Update moved AGENTS content to new path conventions.
3. Remove obsolete root directory and placeholders.
4. Verify no root `domains` directory remains.

# validation
- [x] Verify moved file paths: `find packages/domains -maxdepth 3 -type f`
- [x] Verify root removal: `test ! -d domains`
- [x] Verify instruction references: `rg -n "domains/|packages/domains" packages/domains/AGENTS.md`

# done_definition
- [x] All acceptance criteria are met.
- [x] Validation commands pass.
- [x] Task document and decision notes are updated.
