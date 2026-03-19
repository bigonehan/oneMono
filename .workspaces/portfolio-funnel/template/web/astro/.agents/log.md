## 2026-02-16 - Lenis 스크롤/모바일 사이드메뉴 추가
- Astro 메인 페이지에 Lenis 기반 부드러운 스크롤과 섹션 중간 지점 스냅 이동 로직을 적용함.
- 모바일 폭(767px 이하)에서만 햄버거 버튼을 노출하고, 클릭 시 좌측 슬라이드 사이드메뉴/오버레이를 열고 닫도록 구현함.
- 외부 네트워크 제한으로 패키지 설치가 불가하여 `src/lib/lenis.mjs`, `src/lib/lenis.d.ts`를 로컬 모듈로 추가해 사용함.
- 검증: `bun run check-types`, `bun run build` 통과.

## 2026-02-16 - user/task table 생성 흐름 적용
- `template/web/astro/.agents/plan.md`를 생성하고 `task.md`를 user/task table 작업 기준으로 갱신함.
- Header `Table` 메뉴 클릭 시 `@adapters/user-gel`로 user/task 데이터를 생성하고 `@tanstack/table-core` 컬럼 정의로 표를 렌더링하도록 구현함.
- 기존 Lenis 스냅 스크롤 및 모바일 사이드메뉴 동작은 유지하면서 table 액션 링크를 별도 처리함.
- 검증: `bun run --cwd template/web/astro check-types`, `bun run --cwd template/web/astro build` 통과.
