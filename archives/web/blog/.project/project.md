# info
name : current_png_ui_index_ui_shadcn_playwright
description : current.png를 기준으로 블로그 스타일 index UI를 구현하고 `@ui/shadcn` 재사용 컴포넌트를 확장하며 Playwright 스크린샷 검증-수정 루프를 완료한다.
spec : next js, react, typescript, tailwind css, shadcn ui, playwright
path : /home/tree/home/template/web/blog

# features
- node_package_workspace
- index_blog_ui_rebuild
- shadcn_reusable_component_extension
- playwright_screenshot_feedback_loop

# rules
- 변경 범위는 index 화면 UI, `@ui/shadcn` 재사용 컴포넌트, Playwright 검증 루프에 한정한다.
- 기존 모노레포 패키지 구조와 import 규칙을 유지한다.
- UI 구현은 Next.js + React + TypeScript + Tailwind CSS + shadcn ui 조합을 유지한다.
- 컴포넌트는 재사용 가능하도록 props 기반으로 설계하고 하드코딩 중복을 피한다.
- Playwright 검증은 스크린샷 비교 결과를 근거로 수정 사항을 반영한다.
- 작업 결과는 current.png와의 시각적 일관성을 목표로 한다.

# constraints
- 불필요한 리팩터링, 포맷팅 전면 수정, 무관한 파일 변경을 금지한다.
- 기존 동작을 깨는 전역 스타일/레이아웃 변경을 금지한다.
- 검증 없는 UI 변경 완료 처리를 금지한다.
- Playwright 테스트는 재현 가능한 명령과 조건으로 실행 가능해야 한다.
- 디자인 토큰/스타일 값은 프로젝트 기존 체계와 충돌하지 않아야 한다.

# domains
## index_ui
### states
- current_png_reference_collected
- index_layout_composed
- section_components_bound
- responsive_rules_applied
- visual_gap_identified
- visual_gap_resolved
### action
- current.png 기준 레이아웃/타이포/간격을 분석한다.
- index 페이지의 섹션 구조를 구성한다.
- 카드/리스트/헤더 등 UI 단위를 조합한다.
- 반응형 브레이크포인트 스타일을 적용한다.
- 시각 차이를 기록하고 수정한다.
### rules
- index 화면의 정보 구조는 블로그 탐색 흐름을 우선한다.
- 스타일 클래스는 의미 단위로 유지하고 중복 선언을 최소화한다.
- 접근성에 필요한 시맨틱 태그를 유지한다.
### constraints
- index 도메인 외 라우트/페이지 변경을 금지한다.
- 데이터 계약 변경 없이 표현 계층 중심으로 수정한다.

## shadcn_component
### states
- reusable_target_identified
- base_component_created
- variant_props_defined
- ui_package_exported
- consumer_page_integrated
### action
- 재사용 대상 UI 조각을 식별한다.
- `@ui/shadcn`에 컴포넌트를 추가한다.
- variant/size/state props를 정의한다.
- 패키지 export 경로를 연결한다.
- index 화면에서 컴포넌트를 사용한다.
### rules
- 컴포넌트 API는 단순하고 명확한 props 중심으로 정의한다.
- 스타일 확장은 tailwind + shadcn 패턴을 따른다.
- 패키지 경계 밖 중복 구현을 만들지 않는다.
### constraints
- `@ui/shadcn` 기존 공개 API 호환성을 깨지 않는다.
- 컴포넌트 추가 시 사용처 없는 dead export를 남기지 않는다.

## playwright_validation
### states
- scenario_defined
- screenshot_captured
- diff_reviewed
- feedback_applied
- regression_rechecked
- validation_passed
### action
- index UI 검증 시나리오를 정의한다.
- Playwright로 기준 스크린샷을 캡처한다.
- 시각 diff를 검토한다.
- 피드백을 반영해 UI를 수정한다.
- 회귀 검증을 재실행한다.
### rules
- 스크린샷 검증은 동일 viewport/환경 조건으로 수행한다.
- diff 원인과 수정 내용을 추적 가능하게 유지한다.
- 통과 전까지 캡처-수정-재검증 루프를 반복한다.
### constraints
- 수동 감각 검토만으로 완료 처리하지 않는다.
- 실패 결과를 무시하고 머지 가능한 상태로 간주하지 않는다.
