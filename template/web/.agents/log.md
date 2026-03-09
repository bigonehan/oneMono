## 2026-03-09 - 작업한일
- `game` 폴더에 Next+Zustand+Three 기반 clicker 기본 앱 구조를 생성했다.
- `@domains/game`에 `system(load/start)`, `stage(load/start/end)`, `character(click-only input)` 객체를 추가했다.
- UI에서 `load -> start -> click input -> 상태 반영` 흐름을 연결하고, character의 위치/클릭 수를 화면에 표시했다.
- 검증: `npm --prefix game install`, `npm --prefix game run lint`, `npm --prefix game run build` 통과.
