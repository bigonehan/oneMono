---
name: astro-lenis-snap-mobile-sidemenu
description: Astro 템플릿에 Lenis 기반 부드러운 스크롤과 모바일 사이드메뉴를 추가한다.
owner: codex
status: done # draft | ready | in-progress | done
related_plan: ./.agents/plan.md
related_change: qmynzvrw
---

# features
- [x] F1. Lenis를 이용한 부드러운 스크롤 및 섹션 단위 스냅 이동
  - objective: 스크롤 중간 지점에서 다음 섹션이 자연스럽게 전체 화면에 정렬되도록 한다.
  - acceptance_criteria:
    - Lenis가 활성화되어 wheel/touch 스크롤이 부드럽게 동작한다.
    - 섹션을 절반 이상 넘겨 스크롤하면 가장 가까운 다음/이전 섹션 시작점으로 부드럽게 이동한다.
- [x] F2. 모바일 전용 햄버거 버튼과 좌측 슬라이드 사이드메뉴
  - objective: 작은 화면에서 탐색 접근성을 높인다.
  - acceptance_criteria:
    - 햄버거 버튼은 모바일 폭에서만 노출된다.
    - 햄버거 클릭 시 좌측에서 사이드메뉴가 슬라이드 인 된다.
    - 오버레이/닫기 버튼/메뉴 항목 클릭으로 메뉴를 닫을 수 있다.

# files
## create
- `./.agents/task.md`: 기능 범위/검증 체크리스트 관리.
- `src/lib/lenis.mjs`: 로컬 Lenis 런타임 모듈.
- `src/lib/lenis.d.ts`: 로컬 Lenis 타입 정의.

## modify
- `src/pages/index.astro`: Lenis 초기화, 섹션 스냅 로직, 모바일 사이드메뉴 마크업/상호작용 추가.
- `src/styles/global.css`: 모바일 메뉴/오버레이 스타일 및 반응형 노출 규칙 추가.

## delete
- 없음

# rule
- Follow architecture order: `domain -> port -> adapter -> composition`.
- For UI changes, add components under `packages/ui/shadcn` and consume via `@ui/shadcn`.
- Use Jujutsu workflow: `jj new` for localized changes, `jj workspace` for structural changes.
- Do not implement code before `./.agents/task.md` is created from this template.
- Keep changes scoped to this feature document.

# implementation_steps
1. 로컬 Lenis 모듈을 Astro 템플릿에 연결한다.
2. `index.astro`에 모바일 사이드메뉴 DOM과 클라이언트 스크립트( Lenis + 섹션 스냅 + 메뉴 토글 )를 추가한다.
3. `global.css`에 모바일 전용 햄버거 표시 규칙, 사이드메뉴/오버레이 애니메이션 스타일을 반영한다.
4. 타입체크 및 빌드를 실행해 동작 가능 상태를 검증한다.

# validation
- [x] Type check: `bun run check-types`
- [x] Tests: `bun run build`
- [x] Manual checks:
  - 모바일 폭에서 햄버거를 누르면 좌측 사이드메뉴가 열리고 닫힌다.
  - 스크롤 중간 지점 이후 자동으로 가장 가까운 섹션이 화면 상단에 정렬된다.

# done_definition
- [x] All acceptance criteria are met.
- [x] Validation commands pass.
- [x] Task document and decision notes are updated.
