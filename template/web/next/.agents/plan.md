---
name: monorepo-next-template
description: Next app template for monorepo using @ui/shadcn components
features:
  - Use @ui/shadcn as the only UI package source
  - Provide a runnable App Router template
libs:
  - next@16.1.5
  - react@^19.2.0
  - react-dom@^19.2.0
design:
  architecture: Next app template in template/web/next, consuming workspace UI package
  patterns: Workspace package import and transpilePackages for shared TS source
  data_flow: page.tsx imports components from @ui/shadcn and renders in App Router
  interfaces: package.json dependency on @ui/shadcn and app-level imports
warnings:
  - Do not add UI components locally in template app
constraints:
  - Components must be added under packages/ui/shadcn and imported via @ui/shadcn
dependencies:
  external: none
  internal: packages/ui/shadcn exports
---

## Goals (완료 정의)
- Template app compiles with @ui/shadcn imports ← **검증 방법**: `bun run check-types`
- Dev server starts without module resolution errors ← **검증 방법**: `bun run dev`

## Non-goals (이번에 안 함)
- Add new shadcn components in this task
- Create domain/port/adapter packages

## Files to touch
- **Create**:
  - `.agents/plan.md`: plan source of truth | implementation checklist
  - `package.json`: template app package definition
  - `tsconfig.json`: TypeScript config for Next app
  - `next.config.js`: Next config with transpilePackages
  - `eslint.config.js`: lint config
  - `next-env.d.ts`: Next TypeScript environment file
  - `app/layout.tsx`: root layout
  - `app/page.tsx`: sample page consuming @ui/shadcn
  - `app/globals.css`: baseline styles
  - `README.md`: template usage notes
- **Modify**:
  - `/home/tree/home/AGENTS.md`: fix template path typo (`template` -> `templates`)

## Milestones
### 1) Scaffold template files
**Exit criteria**: All template files exist and reference @ui/shadcn
- [ ] Create app/config/package files
  - **Verify**: `find . -maxdepth 3 -type f`
  - **Rollback**: remove created files

### 2) Validate buildability
**Exit criteria**: Type check passes and dev server starts
- [ ] Run type check
  - **Verify**: `bun run check-types`
  - **Rollback**: fix config/import mismatches
- [ ] Run dev server
  - **Verify**: startup log without module resolution errors
  - **Rollback**: fix package dependency and next transpile settings

## Risks & Mitigation
- **Risk**: Workspace package import fails in Next bundling → **Mitigation**: set `transpilePackages` for `@ui/shadcn`
- **Risk**: Type check fails due shared package TS settings → **Mitigation**: align with existing monorepo TS config

## Open questions
- [ ] none — **Blocker**: NO

## Decision log
- `2026-02-16`: Keep template minimal and enforce @ui/shadcn usage — clear monorepo convention and low maintenance
