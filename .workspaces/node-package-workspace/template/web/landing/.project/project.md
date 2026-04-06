# info
name : react_zustand_nextjs_landing_page_ui_shadcn_compoent_1_hero_3_section_footer_current_png
description : react, zustand, nextjs 기반 landing page를 구현한다. @ui/shadcn의 메뉴와 컴포넌트를 우선 사용하고 1개의 hero, 3개의 section, footer로 구성한다. 반응형 햄버거 아이콘을 지원하고 메뉴 구성과 배치는 current.png 기준 레이아웃을 따른다.
spec : next js, react, zustand, shadcn/ui, tailwind css
path : /home/tree/home/template/web/landing

# features
- workspace_bootstrap
- landing_page_layout
- responsive_navigation
- hero_section
- section_stack
- footer
- zustand_ui_state

# rules
- Next.js와 React 함수형 컴포넌트 기준으로 구현한다.
- 페이지 구조는 header/navigation, hero, 3개의 section, footer 순서를 유지한다.
- 공용 UI는 shadcn/ui 컴포넌트를 우선 조합하고 필요한 최소 범위에서만 스타일을 확장한다.
- zustand는 모바일 메뉴 열림 상태, 활성 메뉴 식별자 등 UI 상호작용 상태에 한정해 사용한다.
- 메뉴 항목의 정보 구조, 순서, 배치 위계는 current.png 기준 레이아웃을 유지한다.
- 모바일에서는 햄버거 버튼으로 메뉴를 열고 닫을 수 있어야 하며 desktop/mobile 모두 동일한 메뉴 목적지를 제공한다.
- hero는 핵심 가치 제안, 보조 설명, 주요 CTA를 포함해야 한다.
- 3개의 section은 각각 독립된 제목과 설명을 가지며 전체 흐름은 도입, 근거, 전환 구조를 유지한다.
- footer는 필수 보조 링크와 브랜드 또는 저작권 정보를 간결하게 제공한다.
- Tailwind CSS 유틸리티를 중심으로 스타일을 작성하고 시맨틱 태그와 접근성 속성을 함께 적용한다.
- 상호작용이 필요한 영역만 client component로 두고 나머지는 정적 구성으로 유지한다.

# constraints
- 페이지 범위는 단일 landing page로 제한하며 추가 라우트, 대시보드, 인증, 백엔드 연동을 포함하지 않는다.
- hero는 1개, section은 정확히 3개, footer는 1개로 유지하며 생략하거나 합치지 않는다.
- 메뉴 구조와 콘텐츠 위계는 current.png 기준에서 크게 벗어나지 않는다.
- shadcn/ui로 대체 가능한 버튼, 메뉴, 패널을 직접 새로 만들지 않는다.
- zustand를 데이터 저장소처럼 확장하지 않고 UI 상태 관리 범위만 유지한다.
- 인라인 스타일과 과도한 Tailwind arbitrary value 사용을 최소화한다.
- 이미지나 장식 요소가 없더라도 텍스트와 CTA만으로 레이아웃과 메시지가 성립해야 한다.
- 데스크톱과 모바일에서 텍스트 의미, CTA 목적, 메뉴 정보 구조가 달라지면 안 된다.

# domains
## landing_page
### states
- 기본 레이아웃이 초기화된 상태
- 데스크톱 네비게이션이 노출된 상태
- 모바일 햄버거 버튼이 노출된 상태
- 모바일 메뉴가 닫힌 상태
- 모바일 메뉴가 열린 상태
- hero 콘텐츠가 렌더링된 상태
- 3개의 section이 순서대로 렌더링된 상태
- footer 정보가 렌더링된 상태
- 활성 메뉴 항목이 강조된 상태
### action
- 페이지 기본 레이아웃을 렌더링한다
- 메뉴 항목 목록을 표시한다
- 햄버거 버튼으로 모바일 메뉴를 연다
- 메뉴 선택 또는 닫기 동작으로 모바일 메뉴를 닫는다
- hero의 핵심 메시지와 CTA를 표시한다
- 3개의 section에 제목, 설명, 보조 콘텐츠를 배치한다
- footer에 보조 링크와 브랜드 정보를 배치한다
- 현재 위치 또는 선택에 따라 활성 메뉴 상태를 갱신한다
### rules
- landing_page는 header/navigation, hero, 3개의 section, footer를 하나의 연속된 흐름으로 유지한다
- 메뉴 정보 구조와 시각적 배치 위계는 current.png 기준을 따른다
- 네비게이션, 버튼, 패널 등 공용 상호작용 UI는 shadcn/ui를 우선 사용한다
- zustand는 모바일 메뉴와 활성 메뉴 같은 UI 상태만 관리한다
- hero는 핵심 가치 제안과 CTA를 첫 화면에서 즉시 이해 가능하게 제공한다
- 각 section은 독립된 제목과 설명을 가지며 전체 흐름은 도입, 근거, 전환 순서를 유지한다
- footer는 본문 종료 이후 보조 링크와 브랜드 정보를 간결하게 제공한다
- desktop/mobile 모두 동일한 메뉴 목적지와 의미를 유지하고 표현 방식만 반응형으로 조정한다
- 시맨틱 태그와 접근성 속성을 적용해 네비게이션과 CTA 동작을 명확히 한다
### constraints
- landing_page를 여러 개의 별도 페이지 흐름으로 분리하지 않는다
- 메뉴, hero, section, footer의 개수와 역할을 임의로 변경하지 않는다
- UI 상태 관리를 위해 불필요한 전역 store 분할이나 복잡한 비동기 상태를 추가하지 않는다
- 랜딩 페이지 범위를 넘어서는 폼 워크플로, 인증, 데이터 CRUD 기능을 포함하지 않는다
