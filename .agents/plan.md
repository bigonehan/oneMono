# 구현 설계서: user/article + auth/editor + shadcn UI

## 도메인
- 주체: 서비스 사용자(로그인 사용자)
- 중심 객체:
  - `User`: `id`, `name`, `pw`
  - `Article`: `id`, `title`, `body`, `rule`, `created_at`, `modified_at`
- 상태:
  - `User`: 가입/인증 가능 상태
  - `Article`: 생성/수정/조회/삭제 상태
- 동작:
  - User CRUD
  - Article CRUD
  - ID/PW 기반 인증(login/logout/session)
  - 에디터 작성/수정
  - 사용자 글 카드 리스트 조회

## 흐름 (1차 이터레이션)
- 상태변화:
  - `User`가 생성되면 저장되고, `Auth`에서 credential 검증 대상이 된다.
  - `Article`가 생성/수정되면 `created_at`/`modified_at`이 저장된다.
- 도메인간 상호작용:
  - `Auth`는 `User`의 `id/pw`를 사용해 인증한다.
  - `Editor`는 `Article` 입력 모델(`title/body/rule`)을 편집한다.
  - `list_article`은 `Article` 목록을 카드형으로 표시한다.
- 가능한 동작:
  - User: create/read/update/delete
  - Article: create/read/update/delete
  - Auth: signIn/signOut/getSession
  - UI: login form, editor form, article list render

## 컨텍스트
- 기술 스택:
  - 모노레포(Turbo/Bun/TypeScript)
  - Domain/Port/Adapter 분리 구조
  - UI: `@ui/shadcn` 패키지 기반 React 컴포넌트
- 재사용 가능한 것:
  - `packages/domains/user` 기존 모델/유즈케이스 패턴
  - `packages/ports/user` 및 `packages/ports/task` CRUD 포트 패턴
  - `packages/infras/gel-client` in-memory 테이블 스타일
- 스타일 패턴:
  - `src/index.ts`에서 명시 export
  - 모델은 `src/models/*`, 포트는 `src/outbound/*`

## 제약조건
- 사용자 요청 기준으로 모든 신규 코드는 `packages/*` 하위에만 배치한다.
- 기존 동일 성격 패키지가 있으면 신규 생성보다 확장을 우선한다.
- 최소 변경 원칙: 불필요 리팩터링/전역 네이밍 스윕 금지.
- feature 추가 완료 시 `funcion.yaml` 반영이 필요하다.

## 검증
- 완료 기준:
  - `user/article` 도메인/포트가 CRUD 인터페이스로 컴파일된다.
  - `gel-client`에 user/article 스키마가 추가되고 타입 충돌이 없다.
  - `@features/auth`에서 better-auth credential 흐름이 구성된다.
  - `@features/editor`와 `@ui/shadcn` 컴포넌트가 export되고 타입 체크를 통과한다.
- 검증 명령:
  - `bun run check-types`
  - 필요 시 패키지별 `bun run --filter <pkg> check-types`

## 구현 범위(파일 단위 계획)
1. 도메인/포트
- `packages/domains/user/src/models/user.ts`: `email` 제거, `pw` 추가
- `packages/domains/user/src/usecases/create-user.ts`: 새 모델 필드 반영
- `packages/domains/article/*` 신규: 모델/유즈케이스/index/package
- `packages/ports/user/src/outbound/user-crud-port.ts`: User CRUD 시그니처 정렬
- `packages/ports/article/*` 신규: `article_port` CRUD 인터페이스

2. 인프라
- `packages/infras/gel-client/src/index.ts`: `articles` 테이블 및 row type 추가
- `packages/infras/gel-client/src/index.ts`: `users` row를 `id/name/pw` 기준으로 정렬

3. feature/auth
- `packages/features/auth/*` 신규 패키지 생성
- better-auth 기반 id/pw credential auth flow 구성
- domain/port 의존은 직접 DB 접근 대신 port를 우선하도록 설계

4. feature/editor
- `packages/features/editor/*` 신규 패키지 생성
- tiptap 기반 최소 editor component + value change 핸들러

5. ui/shadcn
- `packages/ui/shadcn/components/form/form_login.tsx` 신규
- `packages/ui/shadcn/components/form/form_editor.tsx` 신규
- `packages/ui/shadcn/components/list/list_article.tsx` 신규
- `packages/ui/shadcn/src/index.ts` export 추가

6. 메타 반영
- `funcion.yaml`: domains/features/infras/ui 항목 기능 추가
- feature 구현 완료 시 `./.agents/log.md` 완료 기록 추가

## 모호성/결정 필요 사항
- 패키지 네이밍 규칙 충돌:
  - 현재 레포는 `@domains/*`를 사용 중
  - `packages/domains/AGENTS.md`는 `@domain/*` 강제
- 선택지:
  1. 기존 유지: 이번 작업은 `@domains/*` 유지 (최소 변경, 영향 범위 작음)
  2. 규칙 준수: 이번 작업 전에 전체 `@domains/* -> @domain/*` 정규화
- 권장:
  - 이번 작업은 1안으로 진행하고, 스코프 정규화는 별도 변경으로 분리

## 다음 이터레이션
- auth session 영속화 전략(메모리 vs EdgeDB 실제 연동)
- article 권한 정책(rule 필드 의미: 공개/비공개/역할기반)
- editor 이미지/첨부 확장
