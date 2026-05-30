# info
name : template_navbar_main_profile_qa_navbar_main_hero_carousel_feature_footer_qa_profile_carousel_tag_badge_ui_ui_shadcn
description : 기본적인 랜딩 페이지 template 구축: 반응형 navbar, 라우팅 main/profile/qa, navbar 우측 로그인 사람 아이콘 버튼, main 페이지 hero+carousel+feature+footer, qa 페이지 게시판 리스트와 하단 고정 원형 버튼 클릭 시 채팅창 토글, profile 페이지 카드형 carousel과 tag badge 표시. UI는 @ui/shadcn 우선 사용, 없으면 패키지에 최소 컴포넌트 추가
spec : next js, react, typescript, tailwind css, shadcn ui
path : /home/tree/home/template/web/next

# features
- node_package_workspace
- project_documentation
- commentcreate_action_init_path
- commentread
- commentdelete_action
- app_commentupdate_action

# rules
- Next.js App Router 기준으로 페이지 라우팅을 구성한다.
- 모든 화면 컴포넌트는 TypeScript로 작성한다.
- 스타일링은 Tailwind CSS 유틸리티 클래스를 우선 사용한다.
- UI 요소는 `@ui/shadcn` 컴포넌트를 우선 적용한다.
- `@ui/shadcn`에 없는 UI만 프로젝트 내부 최소 컴포넌트로 보완한다.
- 반응형 동작은 모바일 우선으로 설계한다.
- main/profile/qa 라우트는 navbar에서 항상 접근 가능해야 한다.
- QA 채팅 토글은 하단 고정 원형 버튼 클릭으로만 상태를 전환한다.
- profile 화면은 카드형 carousel과 tag badge를 함께 노출한다.
- 페이지 구조는 main 기준으로 hero, carousel, feature, footer 순서를 유지한다.

# constraints
- 기술 스택은 next js, react, typescript, tailwind css, shadcn ui 범위를 벗어나지 않는다.
- 불필요한 전역 상태 라이브러리를 도입하지 않는다.
- shadcn 대체 컴포넌트 추가 시 사용 목적이 명확한 최소 단위만 구현한다.
- UI 동작은 hydration mismatch가 발생하지 않도록 클라이언트/서버 경계를 명확히 분리한다.
- 접근성 속성(버튼 role, aria-label 등)을 생략하지 않는다.
- 라우팅 경로 명세(main/profile/qa)를 임의로 변경하지 않는다.

# domains
## navbar
### states
- desktop 메뉴 노출 상태
- mobile 메뉴 접힘 상태
- mobile 메뉴 펼침 상태
- 로그인 아이콘 버튼 기본 상태
- 로그인 아이콘 버튼 hover/focus 상태
### action
- 로고 클릭으로 main 이동
- 메뉴 클릭으로 main/profile/qa 이동
- 모바일 햄버거 버튼 클릭으로 메뉴 토글
- 로그인 사람 아이콘 버튼 클릭
### rules
- 모든 페이지에서 동일한 navbar 레이아웃을 사용한다.
- 우측 영역에는 로그인 사람 아이콘 버튼을 항상 배치한다.
- 현재 경로와 일치하는 메뉴는 활성 스타일을 적용한다.
- 모바일에서는 햄버거 메뉴 기반 내비게이션으로 동작한다.
### constraints
- navbar 높이와 주요 간격 토큰은 페이지 간 일관성을 유지한다.
- 내비게이션 요소는 키보드로 모두 접근 가능해야 한다.

## routing
### states
- `/` 진입 상태
- `/profile` 진입 상태
- `/qa` 진입 상태
- 존재하지 않는 경로 접근 상태
### action
- 링크 클릭 라우팅
- 브라우저 뒤로가기/앞으로가기 라우팅
- 직접 URL 입력 라우팅
### rules
- main/profile/qa 3개 경로를 명시적으로 제공한다.
- 라우팅은 Next.js 기본 방식(App Router)을 따른다.
- 페이지 전환 시 레이아웃 공통 영역(navbar)은 유지한다.
### constraints
- 클라이언트 강제 리프레시 없이 정상 탐색 가능해야 한다.
- 경로별 주요 섹션이 누락되지 않아야 한다.

## main_landing
### states
- hero 노출 상태
- carousel 첫 슬라이드 상태
- carousel 중간 슬라이드 상태
- carousel 마지막 슬라이드 상태
- feature 섹션 노출 상태
- footer 노출 상태
### action
- CTA 버튼 클릭
- carousel 이전/다음 이동
- carousel 인디케이터 선택 이동
### rules
- main 페이지는 hero, carousel, feature, footer 순서를 유지한다.
- hero에는 핵심 메시지와 주요 CTA를 포함한다.
- carousel은 카드 또는 배너 단위로 순환 가능해야 한다.
- feature는 핵심 장점을 스캔 가능한 구조로 제공한다.
### constraints
- carousel 조작 요소는 터치/클릭 모두 지원해야 한다.
- 각 섹션은 반응형 브레이크포인트에서 레이아웃이 깨지지 않아야 한다.

## qa_board_chat
### states
- 게시판 리스트 노출 상태
- 플로팅 원형 버튼 기본 상태
- 채팅창 닫힘 상태
- 채팅창 열림 상태
### action
- 게시글 항목 조회
- 하단 고정 원형 버튼 클릭
- 채팅창 닫기 버튼 클릭
### rules
- qa 페이지 기본 콘텐츠는 게시판 리스트다.
- 하단 고정 원형 버튼 클릭 시 채팅창 토글 동작을 수행한다.
- 채팅창이 열리면 게시판 리스트와 시각적으로 충돌하지 않게 배치한다.
- 토글 상태는 단일 boolean 상태로 일관되게 관리한다.
### constraints
- 플로팅 버튼은 스크롤과 무관하게 하단 고정 위치를 유지한다.
- 채팅창은 모바일 화면에서 가시 영역을 침범하지 않도록 크기를 제한한다.

## profile_carousel_tag
### states
- 프로필 카드 carousel 기본 상태
- 프로필 카드 선택 상태
- tag badge 기본 상태
- tag badge 강조 상태
### action
- carousel 이전/다음 이동
- 특정 프로필 카드 선택
- 태그 badge 클릭 또는 포커스
### rules
- profile 페이지는 카드형 carousel을 핵심 컨텐츠로 사용한다.
- 각 카드에는 관련 tag badge를 함께 노출한다.
- tag badge는 시각적 구분이 명확해야 한다.
- carousel 이동 시 현재 카드 정보가 일관되게 갱신된다.
### constraints
- 카드와 태그 정보 매핑이 깨지지 않아야 한다.
- 작은 화면에서는 카드 폭과 태그 줄바꿈이 읽기 가능해야 한다.

## ui_component_policy
### states
- shadcn 컴포넌트 사용 가능 상태
- shadcn 컴포넌트 미제공 상태
- 내부 최소 컴포넌트 사용 상태
### action
- 컴포넌트 선택
- 컴포넌트 조합
- 컴포넌트 확장
### rules
- 동일 목적 UI는 먼저 shadcn 컴포넌트 존재 여부를 확인한다.
- 미제공 UI만 내부 최소 컴포넌트로 구현한다.
- 내부 컴포넌트는 재사용 가능한 최소 props 인터페이스를 유지한다.
- 디자인 토큰은 Tailwind 클래스와 프로젝트 규칙을 우선 적용한다.
### constraints
- shadcn과 내부 컴포넌트 혼용 시 스타일 충돌을 방지한다.
- 과도한 추상화 컴포넌트 생성을 금지한다.

## commentcreate
### states
- 댓글 입력값 초기 상태
- 댓글 입력값 유효 상태(1..500, trim non-empty)
- 댓글 입력값 무효 상태(공백-only/0자/501자 이상)
- 댓글 등록 요청 중 상태
- 댓글 등록 성공 후 목록 갱신 상태
### action
- 댓글 textarea 입력
- 등록 버튼 클릭 시 클라이언트 유효성 검사
- `POST /api/posts/[postId]/comments` 요청 전송
- 서버 인증/검증/정제 후 저장
- 성공 시 클라이언트 목록 즉시 반영
### rules
- `request.method == POST` 경로에서만 댓글 생성한다.
- 인증된 사용자만 댓글 생성할 수 있다.
- 본문은 `1..500`자이며 trim 기준 공백-only를 허용하지 않는다.
- sanitize 결과가 빈 문자열이면 저장하지 않는다.
- 저장 레코드는 `author/content/postId/createdAt` 필드를 포함한다.
### constraints
- 비인증 요청은 `401`로 차단한다.
- 잘못된 `postId` 또는 대상 게시글 없음은 `400/404`를 반환한다.
- 유효 본문만 저장하고 XSS 위험 태그는 sanitize 후 저장한다.

## commentread
### states
- 포스트 상세 진입 초기 댓글 로딩 상태
- 비로그인 댓글 조회 상태
- page=1 기본 조회 상태
- page>=2 추가 조회 상태
### action
- GET `/api/posts/[postId]/comments?page=1` 초기 조회
- postId 기준 댓글 조회 및 `createdAt` 오름차순 정렬
- 서버 기반(SSR/ISR) 초기 댓글 주입
- 추가 페이지 조회 결과 기존 목록에 병합
### rules
- 댓글 읽기는 인증 없이 허용하고 유효 요청은 `200`으로 응답한다.
- 댓글 조회는 페이지 단위로 최대 20개만 반환한다.
- 추가 조회 모드는 `page>=2`에서만 허용한다.
- 초기 화면은 SSR 또는 ISR 경로로 page=1 결과를 렌더한다.
### constraints
- `postId,page -> 댓글 목록(JSON)` 조회 계약을 유지한다.
- `createdAt` 오름차순 정렬을 유지한다.
- 추가 페이지 데이터는 기존 목록 뒤에 이어 붙인다.

## app_commentupdate_action
### states
- 댓글 기본 조회 상태
- 인라인 편집 모드 상태
- 수정 저장 요청 중 상태
- 수정 성공 상태
- 수정 실패 상태
### action
- 댓글 `수정` 버튼 클릭
- `저장` 버튼 클릭으로 `PATCH /api/comments/[commentId]` 요청
- 서버 액션 경로에서 요청자/작성자 권한 확인
- 업데이트 결과를 UI 목록 상태에 반영
### rules
- 입력은 `commentId`/`content`를 검증한다.
- 본인 댓글만 수정 가능하다.
- 성공 시 `updatedAt`이 갱신되어야 한다.
- 기존 댓글 조회/삭제/답글 흐름은 변경하지 않는다.
### constraints
- `app/actions/commentupdate.ts|schema.ts|steps.ts` 구조를 유지한다.
- 액션 레지스트리(`app/actions/index.ts`)에서 `commentupdate` 호출 경로가 끊기지 않아야 한다.
- `PATCH /api/comments/[commentId]` 응답 포맷은 액션 계약과 일치해야 한다.
