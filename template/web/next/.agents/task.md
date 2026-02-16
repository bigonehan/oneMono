---
name: next-header-mobile-side-menu
description: Show hamburger only on mobile and open left side menu drawer on selection
owner: codex
status: done
related_plan: ./.agents/plan.md
related_change: pwtzrryw
---

# features
- [x] F1. 모바일에서만 햄버거 아이콘 표시
  - objective: 모바일 네비게이션 진입점을 명확히 분리
  - acceptance_criteria:
    - viewport 768px 미만에서만 햄버거 버튼이 보인다
    - viewport 768px 이상에서는 햄버거 버튼이 숨겨진다
- [x] F2. 모바일 햄버거 클릭 시 좌측 사이드 메뉴 표시
  - objective: 모바일 내비게이션 접근성 개선
  - acceptance_criteria:
    - 햄버거 클릭 시 왼쪽에서 슬라이드되는 메뉴가 열린다
    - 오버레이 클릭 또는 메뉴 항목 클릭 시 닫힌다

# files
## create
- none

## modify
- `template/web/next/app/page.tsx`: Header onMenuClick 연결, 모바일 사이드메뉴 상태/마크업 추가
- `template/web/next/app/globals.css`: 모바일 전용 표시 및 좌측 드로어/오버레이 스타일 추가

## delete
- none

# rule
- Follow architecture order: `domain -> port -> adapter -> composition`.
- For UI changes, add components under `packages/ui/shadcn` and consume via `@ui/shadcn`.
- Use Jujutsu workflow: `jj new` for localized changes, `jj workspace` for structural changes.
- Do not implement code before `./.agents/task.md` is created from this template.
- Keep changes scoped to this feature document.

# implementation_steps
1. `Header`의 `onMenuClick`을 페이지 상태와 연결한다.
2. 페이지에 모바일 사이드메뉴/오버레이 마크업을 추가한다.
3. CSS에서 모바일에서만 햄버거 노출, 데스크톱 네비게이션 유지, 드로어 애니메이션을 적용한다.
4. 타입 체크로 변경 검증한다.

# validation
- [x] Type check: `bun run check-types`
- [ ] Tests: `N/A`
- [x] Manual checks:
  - 모바일에서 햄버거 버튼 클릭 시 좌측 사이드메뉴가 열린다.
  - 모바일에서 메뉴/오버레이 클릭 시 사이드메뉴가 닫힌다.
  - 데스크톱에서 햄버거는 보이지 않고 상단 nav만 보인다.

# done_definition
- [x] All acceptance criteria are met.
- [x] Validation commands pass.
- [x] Task document and decision notes are updated.
