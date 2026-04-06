# problem
현재 `structure_viewer` 앱 디렉터리가 비어 있다.
현재 작업 디렉터리를 기준으로 모노레포 루트와 `domains` 또는 `domain` 폴더를 탐색하고, 파일/함수 구조를 시각적으로 확인할 수 있는 Astro 기반 앱 초안을 만들어야 한다.
초기 UI는 PixiJS에서 사각형 카드 안에 모듈명과 그 아래 함수 목록이 펼쳐지는 화면까지 동작해야 한다.

# tasks
- `orc-cli-workflow` 순서로 `.project/project.md`, `.project/plan.yaml`, `job.md`, `.project/drafts.yaml`을 생성한다.
- ORC 구현 결과를 바탕으로 Astro, Zustand, PixiJS, React Three Fiber 의존성과 초기 구조 뷰 UI가 연결되었는지 확인한다.
- 현재 폴더 기준으로 모노레포 루트 및 `domains|domain` 폴더를 찾는 로직과 파일/함수 목록 제공 흐름을 확인한다.
- `@ui/shadcn` 사용 가능 여부를 확인하고, 있으면 기존 컴포넌트를 우선 활용한다.
- 검증 실패 시 `job.md`와 `report.md`를 반영해 재시도한다.
- 재시도에서는 긴 요구사항 문자열을 tmux pane에 직접 보내지 않고, 짧은 `orc` 인자 또는 로컬 `job.md` 기반 단계 명령으로 분리 실행한다.
- 강제 실행 항목: 실패 단계마다 새 worker pane을 열고, 단계 완료 여부는 `.project/*`, `job.md`, `report.md` 파일 생성으로 판정한다.
- tmux worker가 정체되면 동일한 `orc` 단계를 현재 셸에서 직접 실행해 출력과 종료 코드를 확보한 뒤 다음 단계로 진행한다.
- `orc clit test` 실패 원인인 Rust CLI 바이너리 부재를 해결하기 위해 `cargo run -- --help`가 통과하는 실행 진입점을 추가한다.
- CLI 실행 시 현재 작업 디렉터리 기준 모노레포 루트 탐색, `domains|domain` 폴더 탐색, 웹서버 시작 흐름을 실제 코드로 연결한다.
- UI 자동 검증을 위해 discovery API 호출, Zustand 저장, Pixi 카드 렌더, 함수 리스트 반영 경로를 실행 기반으로 확인한다.
- 재시도 사유: `orc add_orc_drafts` 장시간 정체.
- 실패 원인 해결: draft 생성은 `orc add_orc_drafts`를 실행하고, 성공 즉시 `orc impl_orc_code`를 연속 실행한다.
- 강제 실행 항목: `orc add_orc_drafts` 완료 로그 확인 후에만 다음 단계로 진행한다.
- 재시도 사유: `orc add_orc_drafts`도 동일 정체.
- 실패 원인 해결: draft 재생성은 생략하고 기존 `.project/drafts.yaml` 기준으로 `orc impl_orc_code -> orc clit test -> orc check_orc_code`를 강제 실행한다.
- 강제 실행 항목: draft 단계 명령 재실행 금지, 검증 단계 결과 파일(`job.md`, `report.md`)로 완료 판정한다.
- 재시도 사유: `cargo run -- --help` 실패(exit 254).
- 실패 원인 해결: CLI는 `--help|-h`에서 즉시 사용법 출력 후 종료 코드 0을 반환하도록 유지하고, 그 다음 `orc clit test -p .`를 재실행한다.
- 강제 실행 항목: help 인자 실행이 성공(0)으로 확인되기 전에는 완료 판정하지 않는다.

# check
- `orc init_orc_project -a`
- `orc init_orc_job`
- `orc init_orc_job`
- `orc add_orc_drafts`
- `orc impl_orc_code`
- `orc clit test -p . -m "structure viewer initial build verification"`
- `orc check_orc_code`
- 재시도 사유: `orc check_orc_code` 장시간 정체.
- 실패 원인 해결: 체크 단계는 `orc check_orc_code`로 축소 실행하고 생성 파일(`report.md`, `job.md`)로 완료 판정한다.
- 강제 실행 항목: `orc check_orc_code` 종료 코드 확인 후에만 마감한다.

- 요청 반영: 하위 워크스페이스(`pnpm-workspace.yaml`, 루트 `workspaces`)를 정리해 상위 모노레포 기준으로 동작하도록 수정한다.
- 요청 반영: 루트 `package.json`에 실행/테스트 스크립트를 추가해 `pnpm run test`로 검증 가능하게 만든다.
- 검증: `pnpm run test`와 `cargo run -- --help`가 성공해야 완료로 판정한다.

- 요청 반영: R3F 뷰포트에서 cube 중심 텍스트는 domain 이름으로 표시한다.
- 요청 반영: cube 주변 그래프형 텍스트는 선택 domain의 function 이름 목록을 표시한다.
- 최소 변경: `src/rendering/runtime/types.ts`, `src/components/App.tsx`, `src/rendering/runtime/R3FViewport.tsx`만 수정한다.
- 검증: `pnpm run test`를 실행해 기존 검증 경로가 깨지지 않는지 확인한다.

- 요청 반영: create/delete/load/update/filter/convert/calc 아이콘 매핑을 도입하고 함수명 왼쪽에 아이콘을 렌더한다.
- 요청 반영: 도메인 로드 시 함수명 기준 아이콘/설명 매퍼를 내부 생성하고 화면 데이터에 포함한다.
- 요청 반영: 기능 선택 시 설명을 보여주고 설명 소스는 `<domain path>/.project/function.yaml`을 사용한다(없으면 생성).
- 요청 반영: 신규 기능이 생기면 icon 매핑과 description 항목이 function.yaml에 자동 추가되도록 동기화한다.
- 최소 변경: discovery 계층 + App 렌더 + 타입만 수정한다.
- 검증: `pnpm run test` 실행, `rg`로 트리거->핸들러->상태/UI 반영 경로 점검.

- 버그 수정: cube 주변 기능 라벨 클릭 시 선택 반응이 없거나 약한 문제를 해결한다.
- 원인 보정: domain 단위 함수 id 충돌 가능성을 제거하고, R3F 라벨 클릭 이벤트를 `onPointerDown` 기반으로 명시 처리한다.
- 검증: `pnpm run test` 실행 후 `rg`로 `onFunctionSelect -> selectFunction -> selectedFunction.description` 경로를 다시 확인한다.

- 요청 반영: 마우스 휠 입력 시 camera를 z축으로 tween 이동시킨다.
- 제약 반영: 레벨은 최대 4단계(0~3)로 제한하고, 레벨당 일정 거리만 이동한다.
- 구현 위치: `src/rendering/runtime/R3FViewport.tsx`에 wheel -> level 상태와 camera lerp 루프를 추가한다.
- 검증: `pnpm run test` 실행, `rg`로 onWheel/level clamp/camera z lerp 경로 확인.

- 요청 반영: 마우스가 3D canvas 위에 있거나 focus 상태일 때 페이지/외부 스크롤을 차단한다.
- 요청 반영: 해당 상태의 wheel 입력은 3D zoom 로직에만 전달되도록 한다.
- 구현: `src/rendering/runtime/R3FViewport.tsx`에서 hover/focus 상태 + window capture wheel preventDefault를 추가한다.
- 검증: `pnpm run test` 및 `rg`로 hover/focus/wheel-capture 경로 확인.

- 요청 반영: 3D canvas 하단에 원형 대형 plane(mesh circle)를 추가한다.
- 요청 반영: domain cube + function text를 하나의 domain group 객체로 구성한다.
- 요청 반영: 선택 domain 외 나머지 domain도 거리 두고 배치하고, 선택 변경 시 camera가 해당 domain 중심으로 tween focus 하도록 구현한다.
- 구현 범위 최소화: `src/components/App.tsx`, `src/rendering/runtime/types.ts`, `src/rendering/runtime/RenderingRuntimeBridge.tsx`, `src/rendering/runtime/R3FViewport.tsx`.
- 검증: `pnpm run test` + `rg`로 트리거(다른 cube 클릭) -> 핸들러(selectDomain/selectFunction) -> 상태(selectedDomainId) -> camera focus tween/UI 반영 경로 점검.

- 요청 반영: 카메라 포커스 tween의 급격한 이동을 완화한다.
- 요청 반영: 마우스 이동을 따라 카메라 시선이 약하게 반응하도록 exponential decay 기반 look offset을 추가한다.
- 구현 범위 최소화: `src/rendering/runtime/R3FViewport.tsx`의 CameraFocusRig/포인터 입력 처리만 수정한다.
- 검증: `pnpm run test`, `rg`로 decay 계수/마우스 offset/카메라 lookAt 경로를 확인한다.

- 버그 수정: domain 선택 시 camera가 cube 정면으로 재배치되는 어색한 이동을 제거한다.
- 해결: target 변경 시 현재 camera-target 오프셋을 캡처해 유지하고, 새 target으로는 오프셋을 보존한 채 tween 이동한다.
- 검증: `pnpm run test` + `rg`로 offset 유지(ref)/target change 감지/lerp 이동 경로를 확인한다.

- 요청 반영: 마우스가 canvas 경계를 벗어나면 look offset이 반드시 0,0으로 리셋되도록 보강한다.
- 구현: `src/rendering/runtime/R3FViewport.tsx`에 viewport ref + window pointermove 경계 감시를 추가한다.
- 검증: `pnpm run test`와 `rg`로 outside-reset 경로를 확인한다.

- 요청 반영: cube 선택 시 카메라 동작을 2단계 시퀀스로 변경한다.
- 시퀀스: (1) 현재 시점 오프셋 유지 상태로 선택 cube까지 이동 -> (2) 잠시 대기 -> (3) cube 정면 위치로 이동.
- 구현: `src/rendering/runtime/R3FViewport.tsx`의 `CameraFocusRig`에 phase 상태 머신(follow/pause/front) 추가.
- 검증: `pnpm run test` 및 `rg`로 phase 전환, pause 타이머, front offset 이동 경로 확인.

- 요청 반영: 캔버스 바깥 이탈 시 look offset을 0으로 리셋하지 않고 마지막 값을 유지한다.
- 요청 반영: 캔버스 재진입 시 이전 look offset과 새 포인터 위치 사이를 보간(tween)해 시선 이동한다.
- 구현: `src/rendering/runtime/R3FViewport.tsx`에서 reset 로직 제거 + lookTargetOffset 도입 + CameraFocusRig 내부 exponential decay smoothing 추가.
- 검증: `pnpm run test` 및 `rg`로 leave/outside reset 제거, enter/move target 갱신, decay 보간 경로 확인.

- 요청 반영: 카메라 tween(이동/시선 보간)을 제거하고 즉시 반영 방식으로 변경한다.
- 구현: `src/rendering/runtime/R3FViewport.tsx`의 `CameraFocusRig`에서 phase/lerp/exp decay 제거.
- 검증: `pnpm run test` 실행.
- 오류 수정: `R3FViewport`의 `useRef` 누락 import를 복구한다.
- 검증: `pnpm run test`로 SSR/빌드 경로가 다시 통과하는지 확인한다.

- 요청 반영: mouse down 시 직전 포인터 위치와 현재 눌린 위치를 기록한다.
- 요청 반영: 기록된 두 좌표를 인자로 `tween` 이동 함수를 호출해 카메라 이동에 반영한다.
- 구현 범위: `src/rendering/runtime/R3FViewport.tsx`에서 pointer refs + `startPointerPressTween` 추가.
- 검증: `pnpm run test`, `rg`로 down 이전/현재 좌표 기록 및 tween 함수 호출 경로 확인.

- 요청 반영: `startPointerPressTween(before, pressed)` 적용 시 딜레이를 넣어 즉시 점프가 아닌 천천히 시작되도록 조정한다.
- 구현: `src/rendering/runtime/R3FViewport.tsx`에 press tween delay 타이머(ref) 추가, pointer up 시 타이머 정리.
- 검증: `pnpm run test` 및 `rg`로 delay timer/setTimeout/clearTimeout 경로 확인.
