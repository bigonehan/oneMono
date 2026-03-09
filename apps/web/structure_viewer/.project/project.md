# info
name : build_structure_viewer_with_astro_pixijs_zustand_react_three_fiber_monorepo_root_and_domains_domain_discovery_and_an_initial_module_card_ui_with_function_lists
description : Build structure_viewer with astro, pixijs, zustand, react three fiber, monorepo root and domains/domain discovery, and an initial module card UI with function lists
spec : astro, react, typescript, pixijs, zustand, react three fiber
path : ./.project/project.md

# features
- workspace_bootstrap

# rules
- Astro는 앱 엔트리와 페이지 조합 레이어를 담당한다.
- React는 상호작용이 필요한 뷰와 패널, 모듈 카드 UI를 담당한다.
- TypeScript는 전 영역에서 공통 타입과 도메인 계약을 강제한다.
- PixiJS는 구조 시각화의 2D 런타임으로만 사용한다.
- React Three Fiber는 선택적 3D 시각화 런타임으로만 사용한다.
- Zustand는 발견된 도메인, 모듈, 함수 목록, 선택 상태, 필터 상태의 단일 클라이언트 상태 저장소로 사용한다.
- 모노레포 루트는 워크스페이스 등록, 공통 설정, 공유 규칙의 기준점이 된다.
- domain discovery는 워크스페이스 내부 도메인과 모듈 정보를 수집하고 정규화한 뒤 UI에 전달한다.
- 초기 UI는 모듈 카드와 함수 리스트를 함께 보여주는 검증 가능한 최소 화면을 제공한다.
- 함수 리스트는 발견된 모듈 데이터에 의해 생성되어야 하며 하드코딩된 예시값을 사용하지 않는다.
- 도메인 로직, 상태 로직, 렌더러 로직은 역할 경계를 유지한다.
- 새 동작은 기존 도메인 책임을 확장하는 방식으로 추가하고 중복 책임을 만들지 않는다.

# constraints
- 범위는 workspace bootstrap과 초기 구조 뷰어 동작 검증에 필요한 최소 구현으로 제한한다.
- 프로젝트는 astro, react, typescript, pixijs, zustand, react three fiber 조합과 충돌하지 않아야 한다.
- discovery 파이프라인은 선택적 메타데이터가 비어 있어도 안정적인 빈 상태를 반환해야 한다.
- 초기 구현은 원격 API나 백엔드 의존성 없이 동작해야 한다.
- 렌더러 계층은 도메인 데이터의 소스 오브 트루스가 될 수 없다.
- 상태 구조는 예측 가능하고 디버깅 가능한 수준으로 단순해야 한다.
- 도메인 미발견, 모듈 없음, 함수 없음 상황에서도 UI는 깨지지 않아야 한다.
- 초기 모듈 카드 UI는 조회 중심이며 코드 편집, 그래프 작성, 드래그 앤 드롭은 범위 밖이다.
- 모노레포 설정은 특정 패키지 매니저의 우회 동작에 과도하게 결합되지 않아야 한다.
- 추상화는 현재 요구를 넘어서 확장 예측만으로 추가하지 않는다.

# domains
## monorepo_root
### states
- workspace_uninitialized
- workspace_configured
- packages_registered
- shared_tooling_ready
### action
- 워크스페이스 루트 설정을 초기화한다
- 앱과 공유 패키지 경계를 등록한다
- 공통 TypeScript 및 빌드 규칙을 제공한다
- discovery에 필요한 워크스페이스 메타데이터를 노출한다
### rules
- 모노레포 루트는 공통 의존성과 도구 규약의 기준이 된다
- 앱 전용 설정은 공유 워크스페이스 규칙을 임의로 덮어쓰지 않는다
- 공통 설정은 Astro 앱과 지원 패키지에서 함께 재사용 가능해야 한다
- 워크스페이스 등록 정보는 discovery 대상 범위를 명확히 표현해야 한다
### constraints
- 루트 설정은 현재 스택 요구를 충족하는 최소 범위만 포함한다
- 공유 설정은 순환 패키지 의존성을 만들지 않아야 한다
- 루트 도메인은 뷰 전용 상태를 직접 소유하지 않는다

## domain_discovery
### states
- discovery_idle
- discovery_scanning
- discovery_loaded
- discovery_empty
- discovery_error
### action
- 등록된 워크스페이스 도메인을 스캔한다
- 발견된 도메인과 모듈 메타데이터를 정규화한다
- 모듈별 함수 리스트 항목을 수집한다
- 정규화 결과를 상태 관리 계층에 전달한다
### rules
- discovery 결과는 UI 전달 전 안정적인 타입 구조로 정규화되어야 한다
- 일부 메타데이터가 없어도 전체 화면을 실패시키지 않고 빈 컬렉션으로 수렴해야 한다
- discovery 로직은 렌더링 라이브러리와 분리된 순수 도메인 로직으로 유지한다
- 도메인, 모듈, 함수 식별자는 새로고침 간 일관성을 유지해야 한다
### constraints
- discovery 범위는 워크스페이스 내부 입력으로 제한한다
- 초기 구현은 불필요한 고비용 정적 분석에 의존하지 않는다
- 일부 실패가 있어도 사용 가능한 데이터는 계속 전달할 수 있어야 한다

## state_management
### states
- store_idle
- store_hydrated
- selection_changed
- filters_applied
- panel_synced
### action
- 발견된 도메인, 모듈, 함수 데이터를 저장한다
- 선택된 도메인, 모듈, 함수를 추적한다
- UI 필터와 패널 표시 상태를 관리한다
- 모듈 카드와 렌더러에 필요한 파생 상태를 제공한다
### rules
- Zustand는 뷰어 상호작용 상태의 단일 클라이언트 저장소로 사용한다
- 파생 가능한 UI 상태는 정규화된 discovery 데이터로부터 계산한다
- 상태 변경은 명시적인 액션 흐름으로 관리한다
- 렌더러 어댑터는 상태를 소비할 수 있지만 도메인 모델을 재정의하지 않는다
### constraints
- 저장소 구조는 초기 범위에서 단순하고 추적 가능해야 한다
- 동일한 discovery payload를 여러 슬라이스에 중복 보관하지 않는다
- 초기 상태는 빈 데이터와 첫 로드 상황을 모두 지원해야 한다

## module_card_ui
### states
- card_hidden
- card_empty
- card_list_ready
- card_module_selected
- card_function_focused
### action
- 선택된 모듈 요약을 렌더링한다
- 선택된 모듈의 함수 리스트를 렌더링한다
- 선택 변경과 필터 변경에 반응한다
- 빈 상태와 로드 직후 상태를 표시한다
### rules
- 초기 모듈 카드 UI는 모듈 구조와 함수 목록의 가독성을 우선한다
- 함수 리스트는 discovery 결과로만 구성한다
- UI 컴포넌트는 React 기반으로 유지하고 정규화된 상태를 소비한다
- 모듈 카드는 discovery가 실제로 연결되었는지 확인하는 1차 검증 화면이어야 한다
### constraints
- 초기 범위에는 인라인 편집, 드래그 앤 드롭, 생성/삭제 동작을 포함하지 않는다
- 함수 수가 많아도 기본 레이아웃이 무너지지 않아야 한다
- 빈 도메인과 빈 모듈도 유효한 UI 상태로 렌더링되어야 한다

## rendering_runtime
### states
- renderer_idle
- pixi_ready
- r3f_ready
- renderer_synced
- renderer_disabled
### action
- PixiJS 2D 런타임을 초기화한다
- React Three Fiber 3D 런타임을 초기화한다
- 정규화된 상태를 구독한다
- 선택 상태를 시각 계층에 반영한다
### rules
- PixiJS와 React Three Fiber는 분리된 런타임 경계 뒤에서 동작해야 한다
- 렌더링 계층은 상태와 discovery 결과를 소비하지만 비즈니스 규칙을 소유하지 않는다
- 2D와 3D 런타임은 동일한 식별자와 선택 의미를 공유해야 한다
- 렌더러가 비활성화되거나 실패해도 모듈 카드 UI는 계속 동작해야 한다
### constraints
- 초기 납품에서는 렌더링이 최소 구현이어도 연결 경계는 유지해야 한다
- 3D 런타임의 요구사항이 전체 앱 구조를 지배해서는 안 된다
- 한쪽 렌더러만 활성화된 환경도 허용해야 한다
