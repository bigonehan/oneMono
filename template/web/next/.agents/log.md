## 2026-02-16 - 헤더 모바일 햄버거 사이드메뉴 적용
- 모바일(767px 이하)에서만 햄버거 아이콘이 노출되도록 정리
- 햄버거 클릭 시 좌측 슬라이드 사이드 메뉴/오버레이가 열리도록 구현
- 오버레이 클릭과 메뉴 링크 클릭 시 닫힘 동작 추가
- `bun run check-types` 검증 완료

## 2026-02-16 - user/task table 도메인-포트-어댑터 흐름 추가
- `packages/domains/{user,task}`, `packages/ports/{user,task}`를 생성해 CRUD 모델/계약을 분리함.
- `packages/infras/gel-client`, `packages/adapters/user-gel`을 추가해 gel 기반(in-memory) user/task 생성 및 join row 조회를 구현함.
- Header에 `Table` 메뉴를 추가하고, next 템플릿에서 클릭 시 user와 연관 task를 생성해 TanStack Table로 렌더링되도록 연결함.
- 검증: `bun run --cwd packages/adapters/user-gel test`, `bun run --cwd template/web/next check-types` 통과.
