## 2026-03-09 - 작업한일
- `nestjs_graphql_relay_node_edge_connection_pageinfo_id` draft_item 구현 완료 처리: `.project/drafts.yaml` 항목 존재/필드/constraints(`[]`) 검증 후 `.project/check_list.md` 체크 반영.

## 2026-03-09 - 작업한일
- `cursor_relay_pagination_deprecation_0_100_1` draft_item 구현 완료 처리: `src/lib.rs`에 cursor 기반 Relay 페이지네이션 정규화/offset-limit deprecation/`first`(0~100, 기본 1) 검증 로직과 테스트를 추가하고 `.project/check_list.md` 및 `report.md`를 갱신.

## 2026-03-09 - 작업한일
- `dataloader` draft_item 구현: `Cargo.toml`, `src/lib.rs`를 추가하고 배치 조회 + 캐시 동작 DataLoader를 구현했다.
- 검증: `cargo test` 실행 결과 2 passed, 0 failed.

## 2026-03-09 - 작업한일
- `dataloader` draft_item 완료 확인: `src/lib.rs`의 DataLoader 구현 존재를 확인하고 `cargo test`(5 passed)로 검증했다.

## 2026-03-09 - 작업한일
- `templates/server/lecture`에 NestJS + GraphQL(Relay 스타일) 백엔드를 생성하고 `@domains/review`, `@domains/study/*` 도메인 파일 및 `mainCourses/introCourse/detailCourse/userPage` 쿼리를 구현.
- `web/lecture`에 Astro 프론트(`index`, `intro/[id]`, `detail/[id]`, `user`)를 생성하고 GraphQL API 연동 및 오류 표시 UI를 구현.
- 실행 검증 완료: backend build, frontend build, 백엔드 서버 실기동 후 GraphQL `mainCourses` 쿼리 응답 확인.

## 2026-03-09 - 작업한일
- `temp-study` 검증 흐름을 위해 GraphQL `registerTempStudy` mutation을 추가하고 목록(`mainCourses`) 및 상세(`detailCourse`) 조회 연동을 완료.
- `vitest` 기반 테스트(`lecture.service.spec.ts`)로 저장/목록/상세/중복 방지 흐름을 자동 검증하고 통과.
- 실행 검증으로 서버 기동 후 mutation/query(cURL) 순서를 수행해 실제 응답을 확인.

## 2026-03-09 - 작업한일
- 사용자 페이지 `fetch failed` 문제 대응: API endpoint 재시도 로직 추가(`LECTURE_API_URL`/`127.0.0.1`/`localhost`) 및 user 페이지 fallback 렌더링 적용.
- 백엔드 미기동 상태에서도 `/user`가 임시 데이터로 끊기지 않게 복구했고, 테스트/빌드/실행 검증을 완료.

## 2026-03-09 - 작업한일
- `/home/tree/home/template/server/lecture`를 별도 Gel project + NestJS 백엔드로 구축하고 `lecture-backend` 로컬 인스턴스와 도메인 스키마/migration을 구성.
- `web/lecture`의 `npm run dev`가 `server/lecture` 백엔드를 함께 실행하도록 연동하고, Gel 데이터가 메인/사용자/상세 페이지에 렌더되는 것을 검증.

## 2026-03-09 - 작업한일
- 강의 사이트 설계 문서 대비 누락 라우트를 보완: `/search`, `/category/:id`, `/courses*`, `/cart`, `/checkout`, `/my/*`, `/instructor/*`, `/admin/*`, `/verify/:uuid` 페이지를 추가.
- 학습/장바구니 핵심 흐름을 연결: `/courses/:id/learn` 진도 저장(localStorage), `/cart` 임시 장바구니 추가/삭제 동작 구현.
- 도메인 보완으로 `templates/server/lecture/src/domains/study/payment.ts`를 추가하고 `npm run build`, `orc clit test`, `orc check_code_draft` 검증을 완료.
