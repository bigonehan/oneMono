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
