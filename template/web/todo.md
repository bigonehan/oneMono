# problem
`game` 신규 앱 검증에서 ESLint patch 오류와 `three` 타입 선언 누락으로 lint/build가 실패했다.

# tasks
- ESLint를 Next 15 호환 조합으로 고정(`eslint@8`, `.eslintrc.json` 기반)한다.
- `@types/three`를 devDependency에 추가한다.
- 실패 원인에 대한 강제 실행 항목: 의존성 수정 후 반드시 `npm --prefix game install`을 재실행한다.
- `@domains/game` lifecycle(load/start/end) 및 click-only input 흐름이 유지되는지 호출 경로를 재점검한다.
- lint/build를 재실행해 통과 여부를 확인한다.

# check
- `npm --prefix game install`
- `npm --prefix game run lint`
- `npm --prefix game run build`
- `rg -n "start_game|start_system|start_stage|click_stage|input_stage|input_character" game -S`
