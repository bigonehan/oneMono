---
name: user-task-table-domain-port-adapter
description: Implement user/task table flow using domain-port-adapter and gel infra with tanstack table
owner: codex
status: done
related_plan: ./.agents/plan.md
related_change: zkomyokq
---

# features
- [x] F1. user/task 도메인 모델 생성
  - objective: user와 task 핵심 모델을 도메인 계층으로 분리
  - acceptance_criteria:
    - `packages/domains/user`에 user 모델이 존재한다.
    - `packages/domains/task`에 task 모델이 존재한다.
- [x] F2. user/task CRUD 포트 생성
  - objective: 애플리케이션이 인프라 구현과 분리된 계약에 의존하도록 구성
  - acceptance_criteria:
    - `packages/ports/user`에 user CRUD 포트가 존재한다.
    - `packages/ports/task`에 task CRUD 포트가 존재한다.
- [x] F3. gel 인프라 및 user adapter 생성
  - objective: gel 기반 저장소를 통해 user와 연관 task 데이터를 조회/생성
  - acceptance_criteria:
    - `packages/infras` 하위 gel 관련 패키지가 존재한다.
    - `packages/adapters` 하위 user adapter가 포트를 구현한다.
- [x] F4. next 템플릿에 table 메뉴/화면 추가
  - objective: header의 table 메뉴를 통해 user+task 데이터 생성/표시
  - acceptance_criteria:
    - header에 `Table` 메뉴가 보인다.
    - `Table` 클릭 시 user와 연관 task 데이터가 생성된다.
    - tanstack table로 user/task 데이터가 표시된다.
- [x] F5. vitest 테스트 추가
  - objective: adapter 동작을 자동 검증
  - acceptance_criteria:
    - vitest 테스트가 추가되고 통과한다.

# files
## create
- `packages/domains/user/*`: user 도메인 모델/유스케이스
- `packages/domains/task/*`: task 도메인 모델/유스케이스
- `packages/ports/user/*`: user CRUD 포트
- `packages/ports/task/*`: task CRUD 포트
- `packages/infras/gel-client/*`: gel 기반 in-memory 클라이언트
- `packages/adapters/user-gel/*`: user/task port adapter 구현 및 테스트

## modify
- `template/web/next/app/page.tsx`: table 메뉴 액션과 tanstack table 렌더링 연결
- `template/web/next/app/globals.css`: table 섹션 스타일 추가
- `packages/ui/shadcn/components/layout/header.tsx`: Table 메뉴 노출
- `packages/ui/shadcn/src/index.ts`: 필요한 export 정리(필요 시)
- `template/web/next/package.json`: 새 패키지 및 tanstack table 의존성 반영

## delete
- none

# rule
- Follow architecture order: `domain -> port -> adapter -> composition`.
- Use Jujutsu workflow: `jj new` for localized changes.
- Do not implement code outside this feature scope.

# implementation_steps
1. domain 패키지(user/task)를 생성한다.
2. port 패키지(user/task CRUD 계약)를 생성한다.
3. gel infra 패키지 및 user adapter 패키지를 생성하고 포트를 구현한다.
4. next 페이지/header에 table 메뉴와 tanstack table을 연결한다.
5. vitest 테스트와 타입체크를 수행한다.

# validation
- [x] Type check: `bun run --cwd template/web/next check-types`
- [x] Tests: `bun run --cwd /home/tree/home/packages/adapters/user-gel test`
- [x] Manual checks:
  - Header `Table` 메뉴 클릭 시 user/task 데이터가 생성되고 테이블에 렌더링된다.

# done_definition
- [x] All acceptance criteria are met.
- [x] Validation commands pass.
- [x] Task document and decision notes are updated.
