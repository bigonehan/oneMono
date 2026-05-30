---
name: astro-user-task-table
description: template/web/astro에 next와 동일한 user-task table 생성 흐름을 적용
features:
  - Header Table 메뉴 클릭 시 user/task 데이터 생성
  - gel adapter 데이터를 tanstack table-core로 렌더링
libs:
  - @tanstack/table-core@^8.21.3
  - @adapters/user-gel@*
design:
  architecture: 공유 adapter를 astro page script에서 호출해 table 렌더링
  patterns: action link + in-memory adapter + table-core row model
  data_flow: Table 클릭 -> adapter.createUserWithTasks -> adapter.listUserTaskRows -> tbody 렌더
  interfaces: data-table-action DOM action, UserTaskRow view model
warnings:
  - astro side script에서 menu/snap 동작 회귀 방지
constraints:
  - 기존 lenis/sidemenu 동작을 유지하면서 기능을 추가
dependencies:
  external: none
  internal: packages/adapters/user-gel, packages/ui/shadcn
---

## Goals (완료 정의)
- astro에서도 Header `Table` 클릭 시 user/task row가 생성/표시된다 ← **검증 방법**: `bun run --cwd template/web/astro build`
- astro 타입체크가 통과한다 ← **검증 방법**: `bun run --cwd template/web/astro check-types`

## Non-goals (이번에 안 함)
- 서버 API/DB 연동
- table 정렬/페이지네이션 기능 확장

## Files to touch
- **Create**:
  - `template/web/astro/.agents/plan.md`: astro 실행계획
- **Modify**:
  - `template/web/astro/.agents/task.md`: 이번 기능으로 작업 정의 갱신
  - `template/web/astro/src/pages/index.astro`: Table 섹션과 클릭 핸들러 추가
  - `template/web/astro/src/styles/global.css`: table UI 스타일 추가
  - `template/web/astro/package.json`: adapter/tanstack 의존성

## Milestones
### 1) plan/task 정리
**Exit criteria**: astro에 feature 기준 문서가 존재
- [x] `.agents/plan.md`, `.agents/task.md` 준비
  - **Verify**: `ls template/web/astro/.agents`
  - **Rollback**: 문서 수정 롤백

### 2) UI + script 연결
**Exit criteria**: Table 클릭 데이터 생성/표시
- [x] index.astro, global.css, package 수정
  - **Verify**: `bun run --cwd template/web/astro check-types && bun run --cwd template/web/astro build`
  - **Rollback**: UI/script 변경 롤백

## Risks & Mitigation
- **Risk**: table-core API mismatch → **Mitigation**: 최소 API(createTable + getCoreRowModel)만 사용
- **Risk**: anchor 핸들러 충돌 → **Mitigation**: table-action 링크는 기존 anchor scroll 핸들러에서 예외 처리

## Open questions
- [ ] none — **Blocker**: NO

## Decision log
- `2026-02-16`: next와 동일 adapter를 재사용해 도메인/포트/어댑터 분리를 유지
