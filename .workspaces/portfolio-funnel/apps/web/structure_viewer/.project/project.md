# info
name : structure_viewer_domains_domain_astro_zustand_pixijs_react_three_fiber_ui_shadcn_ui_pixi
description : structure viewer 앱: 현재 작업 디렉터리 기준으로 모노레포 루트와 domains/domain 폴더를 탐색하고 파일/함수 구조를 시각화. Astro + Zustand + PixiJS + React Three Fiber 사용, @ui/shadcn 컴포넌트가 있으면 우선 활용. 초기 UI는 Pixi 사각형 카드에 모듈명과 함수 리스트 표시.
spec : astro, react, zustand, pixijs, react three fiber, shadcn/ui
path : /home/tree/home/apps/web/structure_viewer

# features
- node_package_workspace
- rust_cli_workspace

# rules
- Astro를 앱 엔트리와 라우팅의 기준으로 사용한다.
- 상태 관리는 전역 단일 Zustand 스토어를 기준으로 구성한다.
- 렌더링 시각화는 PixiJS를 기본으로 사용하고, 3D 표현이 필요한 경우에만 React Three Fiber를 사용한다.
- `@ui/shadcn` 컴포넌트가 존재하면 동일 역할의 커스텀 컴포넌트보다 우선 적용한다.
- 현재 작업 디렉터리를 기준으로 모노레포 루트와 `domains/domain` 경로를 탐색 대상으로 고정한다.
- 초기 카드 UI는 모듈명과 함수 리스트를 항상 함께 표시한다.
- 도메인별 규칙은 `# domains` 하위 `## <domain_name>` 블록에서만 확장한다.

# constraints
- 탐색 대상 외 경로는 스캔하지 않는다.
- 파일 파싱 실패가 발생해도 전체 시각화 파이프라인은 중단하지 않는다.
- 대량 파일 처리 시 UI 프레임 저하를 막기 위해 렌더 데이터는 요약 단위로 제한한다.
- Zustand 상태 스키마 변경 시 렌더 계층(Pixi/R3F)과 동기화 규약을 유지한다.
- 카드 단위 시각화는 모듈 식별자와 함수 목록이 누락되지 않아야 한다.
- UI 컴포넌트 선택 시 shadcn 우선 규칙을 위반하지 않는다.

# domains
## node_package_workspace
### states
- idle
- scanning_root
- scanning_domain_folder
- parsing_module_files
- building_module_graph
- rendering_cards
- error
### action
- 현재 작업 디렉터리에서 모노레포 루트를 식별한다.
- `domains/domain` 경로의 JS/TS 패키지 파일을 수집한다.
- 모듈별 export/함수 시그니처를 추출한다.
- 추출 결과를 카드 데이터로 정규화한다.
- Pixi 카드 레이아웃을 계산해 화면에 반영한다.
### rules
- 루트 탐색 기준은 실행 시점 cwd로 고정한다.
- 함수 리스트는 모듈 카드 내부에서 이름 기준 정렬을 유지한다.
- 파싱 실패 파일은 오류 목록에 기록하고 나머지 모듈 처리를 계속한다.
- 동일 모듈의 중복 수집 결과는 마지막 파싱 결과로 병합한다.
### constraints
- node_modules 및 빌드 산출물 디렉터리는 스캔 대상에서 제외한다.
- 함수 본문 전체는 저장하지 않고 구조 정보(이름/위치/시그니처)만 유지한다.
- 렌더 데이터 크기는 화면 갱신 성능을 해치지 않도록 제한한다.

## rust_cli_workspace
### states
- idle
- scanning_root
- scanning_domain_folder
- parsing_rust_files
- building_symbol_graph
- rendering_cards
- error
### action
- 모노레포 내 Rust 워크스페이스 루트와 crate 경로를 탐색한다.
- `domains/domain` 하위 Rust 소스 파일을 수집한다.
- `fn`, `impl`, `mod` 단위 구조를 추출한다.
- crate/모듈/함수 관계를 카드 데이터로 변환한다.
- Pixi 카드에 Rust 모듈명과 함수 목록을 렌더링한다.
### rules
- Cargo workspace 구성이 존재하면 해당 멤버 범위 내에서 우선 탐색한다.
- 함수 정보는 공개성(pub 여부)과 함께 표시 가능한 형태로 보존한다.
- 파싱 에러가 있는 파일은 건너뛰되 에러 상태를 스토어에 기록한다.
- 동일 경로 재스캔 시 이전 결과를 교체하고 stale 데이터를 제거한다.
### constraints
- `target` 디렉터리 및 생성 파일은 분석 대상에서 제외한다.
- 매 프레임 전체 재파싱을 금지하고 변경 기반 갱신을 우선한다.
- Rust 구조 추출 결과는 카드 UI 스키마와 호환되는 필드만 노출한다.
