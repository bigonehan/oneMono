---
name: astro-user-task-table
description: Astro 템플릿에서 Header Table 메뉴로 user/task row 생성 및 표시
owner: codex
status: done # draft | ready | in-progress | done
related_plan: ./.agents/plan.md
related_change: zkomyokq
---

# features
- [x] F1. Header Table 메뉴 클릭 시 user/task 데이터 생성
  - objective: next와 동일하게 메뉴 액션 기반 생성 흐름을 제공
  - acceptance_criteria:
    - Header에 `Table` 메뉴가 보인다.
    - `Table` 클릭 시 user와 연관 task 데이터가 생성된다.
- [x] F2. tanstack table-core로 user/task row 렌더링
  - objective: 생성된 데이터를 표 형태로 시각화
  - acceptance_criteria:
    - `#table-section`에 user/task row가 렌더링된다.
    - 데이터가 없을 때 안내 문구가 표시된다.

# files
## create
- `./.agents/plan.md`: astro 작업 plan source of truth

## modify
- `./.agents/task.md`: astro feature 체크리스트
- `src/pages/index.astro`: table section + adapter 호출 + table 렌더링
- `src/styles/global.css`: table section 스타일
- `package.json`: adapter/table-core 의존성 추가

## delete
- 없음

# rule
- Follow architecture order: `domain -> port -> adapter -> composition`.
- For UI changes, add components under `packages/ui/shadcn` and consume via `@ui/shadcn`.
- Use Jujutsu workflow: `jj new` for localized changes, `jj workspace` for structural changes.
- Do not implement code before `./.agents/task.md` is created from this template.
- Keep changes scoped to this feature document.

# implementation_steps
1. Header의 `data-table-action` 클릭을 감지해 생성 액션을 연결한다.
2. `GelUserTaskAdapter`로 user/task 데이터를 누적 생성한다.
3. `@tanstack/table-core` row model로 tbody를 렌더링한다.
4. 타입체크/빌드로 검증한다.

# validation
- [x] Type check: `bun run --cwd template/web/astro check-types`
- [x] Tests: `bun run --cwd template/web/astro build`
- [x] Manual checks:
  - Header Table 클릭 시 row가 2개씩 증가해 렌더링된다.
  - 기존 lenis/sidemenu 동작이 유지된다.

# done_definition
- [x] All acceptance criteria are met.
- [x] Validation commands pass.
- [x] Task document and decision notes are updated.
