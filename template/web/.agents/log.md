## 2026-03-09 - 작업한일
- `game` 폴더에 Next+Zustand+Three 기반 clicker 기본 앱 구조를 생성했다.
- `@domains/game`에 `system(load/start)`, `stage(load/start/end)`, `character(click-only input)` 객체를 추가했다.
- UI에서 `load -> start -> click input -> 상태 반영` 흐름을 연결하고, character의 위치/클릭 수를 화면에 표시했다.
- 검증: `npm --prefix game install`, `npm --prefix game run lint`, `npm --prefix game run build` 통과.
## 2026-03-09 - 작업한일
- `game/src/domains/game/character` 폴더를 추가하고 기본 움직임 usecase `movement-apply.ts`를 생성했다.
- `character-create.ts`의 click 입력 처리 로직을 `apply_character_movement` usecase 호출로 위임했다.
- `@domains/game` index export에 움직임 usecase를 추가했다.
- 검증: `npm --prefix game run lint`, `npm --prefix game run build` 통과.
## 2026-03-09 - 작업한일
- `next` 앱에 공통 navbar 기반 라우팅(`main`, `profile`, `qa`)을 추가하고 우측 로그인 아이콘 버튼을 배치했다.
- `main` 페이지에 hero/carousel/feature/footer 섹션을 구성했다.
- `qa` 페이지에 게시판 리스트와 하단 고정 원형 버튼 기반 채팅창 토글을 구현했다.
- `profile` 페이지에 카드형 carousel과 tag badge UI를 구현했다.
- `@ui/shadcn` 패키지에 `SimpleCarousel`, `TagBadge` 컴포넌트를 추가해 페이지에서 재사용하도록 연결했다.
- 검증: `npm --prefix next run lint`, `npm --prefix next run test` 통과. (`check-types`, `build`는 기존 코드의 선행 오류로 실패)
