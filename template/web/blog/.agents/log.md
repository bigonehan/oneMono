## 2026-03-05 - 작업한일
- blog index UI를 `current.png` 레퍼런스 기반 쇼케이스 레이아웃으로 변경
- `@ui/shadcn`에 `ListBlogShowcase` 컴포넌트를 추가하고 export 연결
- Playwright(headless, firefox) 캡처 및 diff 확인 후 `feedback.md` 기록

## 2026-03-05 - 작업한일
- `@ui/shadcn`에 `CardItem`, `CardList` 컴포넌트를 추가하고 grid 배치 구조로 분리
- 카드 제목 아래 description 4줄 clamp를 적용
- 공통 헤더 네비게이션 메뉴를 추가
- 카드 `path` 속성 클릭 시 `/article/:name` 라우팅과 `article/[name].astro` 페이지를 연결

## 2026-03-07 - 작업한일
- 프로젝트 타입(`code`, `movie`, `write`, `mono`) 표시를 텍스트 칩에서 아이콘+이름 형태로 변경
- `ProjectTypeChip` 공용 렌더러를 추가하고 `ListBlogShowcase`, `CardItem`에 연결
- 아이콘 칩 스타일(`project-type-chip`)을 글로벌 스타일에 추가
