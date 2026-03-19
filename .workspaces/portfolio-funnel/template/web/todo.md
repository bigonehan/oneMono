# problem
`game` 도메인에 `character` 전용 폴더와 기본 움직임 usecase가 분리되어 있지 않아, stage가 character 이동 로직을 직접 다루고 있다.

# tasks
- `game/src/domains/game/character` 폴더를 만들고 기본 이동 usecase 파일을 추가한다.
- 기존 `character-create`의 클릭 입력 처리에서 이동 갱신을 usecase 호출로 위임한다.
- 외부 인터페이스(`input_character`, click-only 규칙)는 유지한다.
- `@domains/game` export 경로를 새 구조에 맞춰 정리한다.

# check
- `npm --prefix game run lint`
- `npm --prefix game run build`
- `rg -n "move|input_character|usecase|character" game/src/domains/game -S`
