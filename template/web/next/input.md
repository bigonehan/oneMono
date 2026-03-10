# landing_page_routing_and_responsive_sections_for_main_profile_qa
- Next.js App Router 기준으로 `/`, `/profile`, `/qa` 라우트를 구성하고 공통 navbar를 유지한다.
- main 페이지는 hero, carousel, feature, footer 순서를 유지하고 모바일 우선 반응형 레이아웃을 적용한다.
- navbar에서 main/profile/qa로 항상 이동 가능하고 현재 경로 활성 스타일을 제공한다.
- qa 페이지는 게시판 리스트 기본 노출과 하단 고정 원형 버튼 기반 채팅 토글을 제공한다.
- profile 페이지는 카드형 carousel과 tag badge를 함께 노출한다.
> App Router 레이아웃에 공통 navbar를 배치하고 main/profile/qa/not-found 라우트를 점검한다.
> main 페이지 섹션(hero→carousel→feature→footer) 반응형 구성과 carousel 조작(터치/클릭)을 구현한다.
> qa 페이지 게시판 리스트와 플로팅 원형 버튼-채팅창 토글 boolean 상태 흐름을 연결한다.
> profile 페이지 카드 carousel-태그 매핑, 작은 화면 가독성, 접근성 속성을 검증한다.

# commentcreate_action_init_path
- 댓글 생성은 `POST /api/posts/[postId]/comments` 경로에서만 처리한다.
- 인증 사용자만 생성 가능하며 본문은 trim 기준 `1..500`자 유효성 및 sanitize를 통과해야 한다.
- 저장 레코드는 `author/content/postId/createdAt` 필드를 포함하고 성공 시 목록에 즉시 반영한다.
- 비인증은 `401`, 잘못된 postId/대상 없음은 `400/404` 계약을 유지한다.
> 댓글 생성 액션 진입 경로와 API 라우트 연결 상태를 점검한다.
> 클라이언트 입력 검증(공백-only/길이)과 서버 sanitize 후 저장 차단 조건을 구현한다.
> 인증/게시글 존재 검증 분기별 응답 코드(401/400/404)를 맞춘다.
> 성공 시 UI 댓글 목록 갱신 흐름을 연결하고 회귀를 확인한다.

