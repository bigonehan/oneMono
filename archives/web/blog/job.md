# node_package_workspace
- 기존 모노레포 패키지 구조와 import 규칙을 유지한다.
- index 화면, `@ui/shadcn`, Playwright 검증 범위를 벗어나는 변경을 금지한다.
> 작업 대상 패키지와 의존 경로를 점검해 현재 워크스페이스 경계를 확정한다.
> UI/컴포넌트/검증 변경이 기존 패키지 계약을 깨지 않도록 경로와 export를 유지한다.

# index_blog_ui_rebuild
- `current.png` 기준으로 index 레이아웃, 타이포, 간격, 반응형 규칙을 적용한다.
- 블로그 탐색 흐름 중심 정보 구조와 시맨틱 태그를 유지한다.
- 데이터 계약 변경 없이 표현 계층만 수정한다.
> `current.png`를 기준으로 섹션 구조와 스타일 차이를 분석한다.
> 카드/리스트/헤더를 조합해 index 화면을 구성하고 반응형 브레이크포인트를 적용한다.
> 시각 diff를 기록하고 수정해 일관성을 맞춘다.

# shadcn_reusable_component_extension
- 재사용 대상 UI 조각을 `@ui/shadcn` 컴포넌트로 확장한다.
- 컴포넌트 API는 variant/size/state props 중심으로 단순하게 설계한다.
- 기존 공개 API 호환성을 유지하고 dead export를 남기지 않는다.
> index 화면에서 중복되는 UI 조각을 식별한다.
> `@ui/shadcn`에 컴포넌트를 추가하고 props 변형 규칙을 정의한다.
> export 경로를 연결하고 index 소비처에 통합해 실제 사용 경로를 확정한다.

# playwright_screenshot_feedback_loop
- 동일 viewport와 동일 실행 조건으로 스크린샷 검증을 수행한다.
- diff 원인과 수정 내역을 추적 가능하게 유지한다.
- 검증 통과 전까지 캡처-수정-재검증 루프를 반복한다.
> index UI 검증 시나리오를 정의하고 기준 스크린샷을 캡처한다.
> diff를 검토해 UI를 수정하고 회귀 검증을 재실행한다.
> `validation_passed` 상태가 될 때까지 반복 검증한다.

