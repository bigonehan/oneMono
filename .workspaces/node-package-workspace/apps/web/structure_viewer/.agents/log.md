## 2026-03-09 - 작업한일
- `integrate_pixijs_and_react_three_fiber_as_rendering_runtime_foundations` 구현 완료.
- PixiJS 런타임 초기화 모듈(`createPixiRuntime`)과 React Three Fiber 뷰포트(`R3FViewport`)를 분리 경계로 추가.
- 브릿지 컴포넌트(`RenderingRuntimeBridge`)에서 선택 상태를 두 런타임에 반영하고 Pixi 초기화 실패 시 UI 지속 동작 폴백 경로 구성.
- `cargo test` 검증을 위한 최소 Rust 테스트 크레이트와 런타임 파일/의존성 선언 검증 테스트 추가.

## 2026-03-09 - 작업한일
- `set_up_zustand_for_shared_client_state_management` 구현 완료.
- 공유 클라이언트 상태용 Zustand 스토어(`useStructureViewerStore`)를 추가해 discovery 데이터, 선택 상태, 필터 상태, reset 액션을 구성.
- 앱 패키지 의존성에 `zustand`를 추가해 상태 스토어 import 경로가 실제 의존성으로 해석되도록 정리.
- `cargo test`를 실행해 검증 통과.

## 2026-03-09 - 작업한일
- `implement_the_initial_module_card_ui` 구현 완료.
- React `App` 컴포넌트가 Zustand 스토어의 정규화된 선택 상태를 소비해 초기 모듈 카드 레이아웃을 렌더링하도록 확장.
- 발견 도메인 없음/선택 모듈 없음/선택 모듈 있음 상태를 각각 분기 처리해 빈 상태에서도 UI가 깨지지 않도록 구성.
- 모듈 요약(도메인, 모듈명, 식별자, 함수 수)과 현재 모듈 필터 표시를 카드 내부에 추가.
- `cargo test` 검증 통과.

## 2026-03-09 - 작업한일
- `define_domains_and_a_domain_discovery_structure_under_the_project` 구현 완료.
- `src/domain/discovery` 경계를 추가해 도메인/모듈/함수 타입과 프로젝트 초기 discovery payload를 분리 정의.
- Zustand store가 discovery 타입을 도메인 경계에서 import하도록 정리해 앱 상태 계층과 discovery 모델 경계를 명확화.
- `App` 시작 시 discovery payload를 hydrate하도록 연결하고, Rust 테스트에 discovery 구조/연결 검증 케이스를 추가.
- `cargo test` 검증 통과.

## 2026-03-09 - 작업한일
- `render_function_lists_inside_the_module_card_ui` 구현 완료.
- 모듈 카드 UI에서 선택 모듈의 함수 목록을 `<ul>`/`<li>` 구조로 렌더링하고 함수 선택 액션(`selectFunction`)을 연결.
- 함수가 없는 모듈에 대해 빈 상태 메시지를 추가해 UI가 깨지지 않도록 처리.
- `cargo test` 기준으로 해당 구현 존재를 검증하는 Rust 테스트(`module_card_renders_function_lists`)를 추가.

## 2026-03-09 - 작업한일
- `structure viewer discovery + pixi module card flow` 기능 추가 완료.
- 서버 API(`src/pages/api/discovery.json.ts`)를 추가해 현재 작업 디렉터리 기준 모노레포 루트 및 `domains|domain` 경로를 탐색하고 도메인/모듈/함수 목록을 반환하도록 구현.
- `App`에서 discovery API를 호출해 Zustand 상태를 hydrate하고, 도메인/모듈 선택과 함수 리스트 렌더를 Pixi 카드/React UI에 동기화.
- Pixi 카드에 선택 모듈명과 함수 리스트 표시를 반영하고, Rust CLI 엔트리(`src/main.rs`)에서 루트 탐색 후 Astro 서버 실행 경로를 연결.
- 검증: `orc clit test -p . -m "structure viewer initial build verification"`, `cargo test`, `orc check_orc_code`.

## 2026-03-09 - 작업한일
- 로컬 중복 워크스페이스 정리 완료(`pnpm-workspace.yaml` 제거, 루트 `package.json`의 `workspaces` 제거).
- 루트 `package.json`에 실행/검증 스크립트 추가(`dev`, `test`, `test:rust`, `test:cli`).
- `pnpm run test` 기준으로 Rust 테스트 + CLI help 실행이 한 번에 가능하도록 구성.

## 2026-03-09 - 작업한일
- R3F cube 라벨/주변 라벨 매핑 규칙 반영 완료.
- cube 중심 텍스트를 선택 domain 이름(`selectedDomainName`)으로 변경.
- cube 주변 그래프 텍스트를 선택 domain이 가진 function 이름 목록으로 렌더하도록 변경.
- 검증: `pnpm run test` 통과, `rg` 호출 경로 점검 통과.

## 2026-03-09 - 작업한일
- function 아이콘/설명 매핑 기능 추가 완료.
- create/delete/load/update/filter/convert/calc 기준 내부 아이콘 매퍼를 도입하고 함수명 왼쪽 아이콘 표시를 연결.
- domain별 `<domain>/.project/function.yaml`을 읽고(없으면 생성), 신규 함수 발견 시 아이콘/설명 항목을 자동 추가하도록 동기화 구현.
- R3F cube 주변 함수 라벨 선택 시 해당 함수를 선택 상태로 반영하고 설명을 화면에 표시하도록 연결.
- 검증: `pnpm run test`, `rg` 호출 경로 점검.

## 2026-03-09 - 작업한일
- cube 주변 기능 라벨 선택 반응 보강 완료.
- R3F 텍스트 sprite 이벤트를 `onClick`에서 `onPointerDown`으로 변경하고 stopPropagation 처리.
- domain 함수 id 충돌을 막기 위해 module 스코프를 포함한 함수 id를 생성하도록 수정.
- 검증: `pnpm run test` 통과, 선택 경로(`onFunctionSelect -> selectFunction -> description`) rg 점검 통과.

## 2026-03-09 - 작업한일
- 휠 입력 기반 R3F 카메라 Z축 트윈 이동(4레벨) 기능 추가 완료.
- 스크롤 이벤트로 zoom level(0~3) 클램프를 적용하고, 레벨당 일정 거리(0.75)로 target z를 계산.
- `useFrame`에서 camera z를 lerp tween으로 보간해 부드럽게 이동하도록 구현.
- 검증: `pnpm run test` 통과, zoom 경로(`onWheel -> level clamp -> camera z lerp`) rg 점검 통과.

## 2026-03-09 - 작업한일
- 3D canvas hover/focus 시 외부 스크롤 차단 기능 추가 완료.
- viewport active 상태일 때 window capture wheel 이벤트에서 `preventDefault`를 적용해 페이지 스크롤/스크롤 드래그를 멈추도록 구현.
- canvas wrapper의 wheel 이벤트는 stopPropagation + zoom level 변경만 처리하도록 고정.
- 검증: `pnpm run test` 통과, hover/focus/wheel-capture 경로 rg 점검 통과.

## 2026-03-09 - 작업한일
- 다중 domain 3D 배치 및 카메라 포커스 트윈 기능 추가 완료.
- 캔버스 하단에 대형 원형 plane(`circleGeometry`)을 추가.
- domain cube + function text를 하나의 `group` 객체(`DomainObject`)로 구성.
- 선택 domain 외 다른 domain도 장면에 거리 두고 배치하고, cube/라벨 선택 시 `selectDomain`과 함께 카메라가 해당 domain 중심으로 tween focus 되도록 구현.
- 검증: `pnpm run test` 통과, `rg`로 선택 트리거->상태->camera tween 경로 점검 통과.

## 2026-03-10 - 작업한일
- 카메라 포커스 이동을 지수 감쇠 기반 tween으로 완화해 급작스러운 점프 느낌을 줄임.
- 마우스 이동에 따라 시선이 약하게 따라가도록 `lookOffset`을 추가하고, `camera.lookAt`에 exponential decay를 적용.
- 포인터 이탈/블러 시 look offset을 0으로 복귀시켜 시선 복원.
- 검증: `pnpm run test` 통과, decay/포인터/lookAt 경로 rg 점검 통과.

## 2026-03-10 - 작업한일
- domain 전환 시 카메라가 cube 정면으로 재배치되는 문제 수정.
- 타깃 변경 시 현재 camera-target 오프셋을 캡처(`cameraOffsetRef`)해 유지하고, 새 domain으로는 해당 오프셋을 보존한 채 tween 이동하도록 보정.
- zoom 값은 오프셋 z축만 지수 감쇠로 보간해 기존 이동 연속성을 깨지 않도록 조정.
- 검증: `pnpm run test` 통과, target-change/offset-preserve/lerp 경로 rg 점검 통과.

## 2026-03-10 - 작업한일
- 마우스가 canvas 경계를 벗어날 때 camera look offset이 확실히 리셋되도록 보강.
- viewport ref + window pointermove 경계 검사로 outside 상태를 감지해 `setLookOffset([0, 0])` 적용.
- 기존 pointer leave/blur 리셋과 함께 동작해 캔버스 외부에서 시선 추적 잔상이 남지 않도록 정리.
- 검증: `pnpm run test` 통과, outside-reset 경로 rg 점검 통과.

## 2026-03-10 - 작업한일
- canvas 이탈 시 look offset 초기화 제거 및 마지막 오프셋 유지 동작으로 변경.
- 재진입 시 새 포인터 위치를 look target으로 갱신하고, `smoothedLookOffsetRef` 지수 감쇠 보간으로 이전값↔신규값 tween 적용.
- pointer enter 시점 좌표도 즉시 반영해 재진입 직후 자연스럽게 시선이 이어지도록 보정.
- 검증: `pnpm run test` 통과, leave-reset 제거/enter-move target 갱신/decay 경로 rg 점검 통과.

## 2026-03-10 - 작업한일
- mouse down 시 직전 포인터 위치와 눌린 현재 위치를 기록하고, 두 좌표를 인자로 `startPointerPressTween`을 호출하도록 구현.
- tween 결과(`pressMoveTarget`)를 카메라 위치 보정에 반영하고, pointer up에서 0으로 복귀시켜 눌림 모션이 자연스럽게 감쇠되도록 구성.
- 검증: `pnpm run test` 통과, down 이전/현재 좌표 기록 + tween 호출 경로 rg 점검 통과.

## 2026-03-10 - 작업한일
- `startPointerPressTween(before, pressed)` 호출에 지연 타이머(140ms)를 추가해 눌림 직후 이동이 천천히 시작되도록 조정.
- 연속 입력 시 이전 타이머를 취소하고 최신 입력만 반영하도록 `clearTimeout` 처리.
- pointer up/unmount 시 타이머 정리로 잔여 지연 호출 방지.
- 검증: `pnpm run test` 통과, delay timer 경로 rg 점검 통과.
