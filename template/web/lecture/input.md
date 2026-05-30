# workspace_bootstrap
- NestJS 백엔드와 Astro 프론트 워크스페이스를 단일 경로에서 빌드/실행 가능하게 구성한다.
- 도메인별 모듈 경계와 디렉터리 구조를 user, @domains, @domains/study 기준으로 분리한다.
> 백엔드/프론트 기본 프로젝트 및 공통 TypeScript 설정 구성
> 도메인 경계 기준 폴더/모듈 스캐폴드 생성

# graphql_relay_core
- GraphQL Relay Node/Edge/Connection/PageInfo 규격을 모든 목록 API에 일관 적용한다.
- 전역 ID는 도메인 프리픽스 기반 인코딩/역변환 정책으로 구현한다.
> Relay 공통 타입/유틸/커서 페이지네이션 베이스 구현
> 도메인별 스키마와 리졸버에 공통 Relay 규격 연결

# backend_domain_service_architecture
- 리졸버는 입출력 매핑과 권한 검증만 수행하고 비즈니스 로직은 서비스 계층에 둔다.
- 데이터 저장소 접근은 서비스 경유만 허용하고 리졸버 직접 접근을 금지한다.
> 도메인 서비스 인터페이스 및 에러 코드 포맷 정의
> 리졸버-서비스-저장소 호출 경로를 도메인별로 연결

# user_domain
- 인증 사용자만 user 페이지 개인 데이터 조회를 수행할 수 있어야 한다.
- 정지 계정은 로그인과 주요 쓰기 작업을 수행할 수 없어야 한다.
> sign_up/sign_in/refresh_token/update_profile 흐름 구현
> 상태 전이와 비밀번호 해시/토큰 검증 제약 적용

# review_domain
- 수강 이력이 있는 사용자만 리뷰를 작성할 수 있어야 한다.
- 신고 누적 임계치 초과 시 리뷰를 hidden 상태로 전환해야 한다.
> create/update/publish/report/hide/delete 액션 구현
> 평점 범위, 권한, 삭제 기본 조회 제외 규칙 적용

# course_domain
- 공개 코스는 최소 1개 이상의 lecture를 포함해야 한다.
- archived 코스는 신규 수강 등록을 받을 수 없어야 한다.
> create/update/publish/archive/assign_category 구현
> slug 고유성, 가격 하한, 캐시 무효화 규칙 적용

# lecture_domain
- lecture는 반드시 하나의 course에 속해야 한다.
- locked lecture는 수강 등록 사용자만 접근할 수 있어야 한다.
> create/update/publish/lock/reorder 구현
> 동일 코스 내 순서 변경, 삭제 강의 진도 제외 규칙 적용

# enrollment_domain
- 동일 사용자의 동일 코스 active 상태 중복 보유를 금지한다.
- completed 전이는 전체 필수 lecture 이수 시에만 허용한다.
> request/activate/complete/cancel/refund 구현
> 환불 기간 제한, canceled 상태 진도 업데이트 금지 적용

# progress_domain
- enrollment가 active 이상일 때만 진도 기록을 허용한다.
- 진행률은 0~100 범위와 단조 증가 정책을 유지해야 한다.
> start/update/complete/recalculate 구현
> course+lecture 유일성 및 코스 진행률 재계산 규칙 적용

# category_domain
- hidden 카테고리는 기본 탐색 목록에서 제외한다.
- 부모-자식 구조에서 순환 참조를 금지한다.
> create/update/hide/reorder 구현
> 이름 중복 제한, 순번 충돌 없는 재정렬 규칙 적용

# cart_coupon_domain
- 장바구니는 중복 course 항목을 허용하지 않아야 한다.
- 쿠폰 적용과 결제 전 검증은 서버 기준으로 재검산해야 한다.
> cart add/remove/apply/clear/checkout 구현
> coupon validate/redeem/expire와 할인 정책 제약 연결

# certification_domain
- completed enrollment 사용자만 인증서 발급 가능 상태가 된다.
- 인증서는 1회 발급 원칙을 따르고 재발급은 이력으로 분리한다.
> eligibility 검사와 issue/revoke/reissue 구현
> 고유 검증 식별자 및 발급 스냅샷 보존 규칙 적용

# notification_domain
- 도메인 이벤트 기반으로 구독 사용자에게 알림을 생성해야 한다.
- 실패 알림은 재시도 정책에 따라 queued로 복귀해야 한다.
> enqueue/send/retry/mark_as_read 구현
> 멱등 키 중복 방지와 서버시간 읽음 처리 기록 적용

# audit_logging_and_resilience
- review/enrollment/progress/cart/coupon/certification/notification 상태 변경은 감사 이벤트 로그를 남겨야 한다.
- 비동기 작업은 타임아웃/재시도 정책을 적용하고 무한 재시도를 금지한다.
> 상태 변경 이벤트 스키마와 로그 저장 파이프라인 구현
> 재시도 큐, 민감정보 마스킹, 실패 비차단 처리 적용

# frontend_main_intro_detail_user
- main/intro/detail/user 페이지는 SSR 초기 데이터 로드를 수행해야 한다.
- API 오류 상태와 hydration 가드를 화면에 반영해야 한다.
> 페이지별 GraphQL 쿼리 조합과 로더 구성
> 오류 분기/브라우저 전용 API 가드/상태 렌더링 구현

# backend_api_integration
- 프론트 데이터 조회는 재사용 가능한 GraphQL 쿼리 단위로 관리한다.
- 공통 에러 코드는 코드 기준 클라이언트 분기 방식으로 처리한다.
> 백엔드 스키마/리졸버와 프론트 쿼리 문서 연동
> 인증 가드/RBAC/에러 코드 기반 응답 처리 연결

# compatibility_and_verification
- 스키마 변경은 하위 호환 deprecation 전략을 우선 적용한다.
- cursor 기반 Relay pagination과 도메인 제약을 테스트로 검증한다.
> 도메인별 단위/통합 테스트 및 N+1 방지 배치 조회 검증
> 페이지네이션, 권한, 상태 전이, 제약 조건 회귀 테스트 실행

