---
name: next-user-task-table
description: template/web/next에서 user-task table 생성 흐름을 domain-port-adapter 순서로 구현
features:
  - user/task domain 모델 분리
  - user/task CRUD 포트 정의
  - gel infra + user adapter 구현
  - Header Table 메뉴 클릭 시 user/task 생성 및 tanstack table 표시
libs:
  - @tanstack/react-table@^8.21.3
  - vitest@^3.2.4
design:
  architecture: domain -> port -> adapter -> template composition
  patterns: in-memory gel table client + adapter join row 변환
  data_flow: Header Table 클릭 -> adapter.createUserWithTasks -> adapter.listUserTaskRows -> UI table render
  interfaces: UserCrudPort, TaskCrudPort, GelUserTaskAdapter
warnings:
  - domain이 adapter/infrastructure에 의존하지 않도록 유지
constraints:
  - require.md 요구사항 범위 밖 기능 추가 금지
dependencies:
  external: none
  internal: packages/domains/*, packages/ports/*, packages/infras/gel-client, packages/adapters/user-gel
---

## Goals (완료 정의)
- user/task domain, port, adapter, gel infra가 생성된다 ← **검증 방법**: `rg --files packages/domains packages/ports packages/infras packages/adapters`
- Header `Table` 클릭 시 user + 연관 task row가 생성/표시된다 ← **검증 방법**: `template/web/next` 수동 확인
- adapter vitest가 통과한다 ← **검증 방법**: `bun run --cwd packages/adapters/user-gel test`
- next 타입체크가 통과한다 ← **검증 방법**: `bun run --cwd template/web/next check-types`

## Non-goals (이번에 안 함)
- 실제 외부 DB 연결
- 인증/권한 처리

## Files to touch
- **Create**:
  - `packages/domains/user/*`: user domain model
  - `packages/domains/task/*`: task domain model
  - `packages/ports/user/*`: user CRUD port
  - `packages/ports/task/*`: task CRUD port
  - `packages/infras/gel-client/*`: gel in-memory table client
  - `packages/adapters/user-gel/*`: port 구현 + 테스트
- **Modify**:
  - `packages/ui/shadcn/components/layout/header.tsx`: Table 메뉴 추가
  - `template/web/next/app/page.tsx`: table 생성 액션/렌더링 연결
  - `template/web/next/app/globals.css`: table section 스타일 추가
  - `template/web/next/package.json`: adapter/tanstack 의존성
  - `package.json`: workspace 패턴 확장

## Milestones
### 1) domain/port/infra/adapter 생성
**Exit criteria**: 코드와 테스트 파일이 생성됨
- [x] 계층별 패키지 생성
  - **Verify**: `rg --files packages/domains packages/ports packages/infras packages/adapters`
  - **Rollback**: 생성 파일 삭제

### 2) next 템플릿 연결
**Exit criteria**: Header Table 클릭 시 row가 표시됨
- [x] Header + page + style 수정
  - **Verify**: `bun run --cwd template/web/next check-types`
  - **Rollback**: page/header 변경 revert

## Risks & Mitigation
- **Risk**: workspace dependency 인식 실패 → **Mitigation**: root workspaces 패턴 확장
- **Risk**: Astro/Next 동시 사용 시 browser runtime 차이 → **Mitigation**: adapter를 browser-safe in-memory 코드로 구현

## Open questions
- [ ] none — **Blocker**: NO

## Decision log
- `2026-02-16`: gel은 in-memory client로 추상화해 template 단계에서 빠르게 검증
