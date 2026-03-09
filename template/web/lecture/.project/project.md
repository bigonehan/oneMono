# info
name : nestjs_graphql_relay_astro_user_review_domains_course_lecture_enrollment_progress_category_cart_coupon_certification_notification_domains_study_intro_detail_user_backend_api
description : 강의 사이트 설계 문서 기반으로 NestJS GraphQL Relay 백엔드와 Astro 프론트를 구현한다. 도메인은 user 기존 활용, review는 @domains, course/lecture/enrollment/progress/category/cart/coupon/certification/notification은 @domains/study 하위로 구성한다. 메인, intro, detail, user 페이지를 구현하고 backend API 연동한다.
spec : nestjs, graphql relay, astro, typescript
path : /home/tree/home/template/web/lecture

# features
- workspace_bootstrap
- dataloader
- edge-backed-lecture

# rules
- 백엔드는 NestJS 모듈 경계를 도메인 단위로 분리하고 GraphQL Relay(Node/Edge/Connection/PageInfo) 규격을 일관 적용한다.
- 스키마 타입, 입력 타입, 리졸버 반환 타입은 TypeScript 타입과 1:1 대응되도록 유지한다.
- Relay 전역 식별자는 도메인 프리픽스 기반으로 인코딩하고 역변환 가능해야 한다.
- Astro 페이지(main, intro, detail, user)는 서버 렌더링 기준으로 초기 데이터 로드를 수행하고 API 오류 상태를 화면에 노출한다.
- 프론트의 데이터 조회는 GraphQL 쿼리 조합을 재사용 가능한 단위로 관리한다.
- 도메인별 비즈니스 로직은 서비스 계층에 두고 리졸버는 입출력 매핑과 권한 검증에 집중한다.
- 리뷰, 수강, 진도, 장바구니, 쿠폰, 알림, 수료 관련 상태 변경은 감사 가능한 이벤트 로그를 남긴다.
- 사용자 인증이 필요한 필드는 인증 가드와 역할 기반 접근 제어를 통과해야 한다.
- 페이지네이션이 필요한 목록은 cursor 기반 Relay pagination만 허용한다.
- 공통 에러 코드는 도메인 독립 포맷으로 통일하고 클라이언트는 코드 기준으로 분기한다.
- 별도 서버 경로(`/home/tree/home/template/server/lecture`)를 사용하고 `web/lecture` dev 명령은 서버와 프론트를 함께 실행해야 한다.
- 영속 데이터는 로컬 Gel 인스턴스 `lecture`의 스키마와 migration으로 관리한다.

# constraints
- 데이터 저장소 접근은 도메인 서비스 경유만 허용하고 리졸버/컴포넌트의 직접 접근을 금지한다.
- N+1 문제 방지를 위해 관계 조회는 DataLoader 또는 배치 조회 전략을 사용한다.
- 비동기 작업은 타임아웃과 재시도 정책을 명시하고 무한 재시도를 금지한다.
- 민감정보(비밀번호, 토큰, 결제정보)는 로그/응답에 노출하지 않는다.
- 쿠폰 적용과 결제 전 검증은 서버 기준으로 재검산한다.
- 수강 진행률은 0~100 범위를 벗어날 수 없다.
- 인증서 발급은 수강 완료 조건 충족 후 1회 발급 원칙을 따르고 재발급은 별도 이력으로 처리한다.
- 알림 전송 실패는 재시도 큐로 이관하고 사용자 요청 흐름을 차단하지 않는다.
- Astro 프론트는 브라우저 전용 API 접근 시 hydration 시점 가드를 둔다.
- 모든 도메인 API는 스키마 변경 시 하위 호환 전략(deprecation)을 우선 적용한다.

# domains
## user
### states
- anonymous
- authenticated
- profile_incomplete
- profile_active
- suspended
### action
- sign_up
- sign_in
- sign_out
- refresh_token
- update_profile
- change_password
- deactivate_account
### rules
- 이메일 기준 사용자 식별은 고유해야 한다.
- 인증 사용자만 user 페이지의 개인 데이터 조회를 수행할 수 있다.
- 정지 계정은 로그인과 주요 쓰기 작업을 수행할 수 없다.
### constraints
- 비밀번호는 해시 저장만 허용한다.
- 토큰 재발급은 만료/폐기 상태를 검증해야 한다.

## review
### states
- draft
- published
- hidden
- reported
- deleted
### action
- create_review
- update_review
- publish_review
- report_review
- hide_review
- delete_review
### rules
- 수강 이력이 있는 사용자만 리뷰를 작성할 수 있다.
- 작성자 본인 또는 관리자만 리뷰를 수정/삭제할 수 있다.
- 신고 누적 임계치 초과 시 hidden 상태로 전환한다.
### constraints
- 평점은 정수 1~5 범위로 제한한다.
- 삭제된 리뷰는 목록 기본 조회에서 제외한다.

## course
### states
- draft
- published
- archived
### action
- create_course
- update_course
- publish_course
- archive_course
- assign_category
### rules
- 공개 상태는 최소 1개 이상의 lecture를 포함해야 한다.
- archived 코스는 신규 수강 등록을 받을 수 없다.
- 카테고리 변경 시 코스 목록 캐시를 무효화한다.
### constraints
- 코스 slug는 전역 고유해야 한다.
- 가격은 0 이상이어야 한다.

## lecture
### states
- draft
- published
- locked
### action
- create_lecture
- update_lecture
- publish_lecture
- lock_lecture
- reorder_lecture
### rules
- lecture는 반드시 하나의 course에 속해야 한다.
- locked lecture는 수강 등록 사용자만 접근할 수 있다.
- 순서 변경은 동일 course 범위 내에서만 허용한다.
### constraints
- 영상/문서 자원은 유효한 접근 권한 토큰으로만 제공한다.
- 삭제된 lecture는 진도 계산에서 제외한다.

## enrollment
### states
- pending
- active
- completed
- canceled
- refunded
### action
- request_enrollment
- activate_enrollment
- complete_enrollment
- cancel_enrollment
- refund_enrollment
### rules
- 동일 사용자는 동일 course에 active 상태를 중복 보유할 수 없다.
- 결제 완료 또는 무료 코스 조건 충족 시 active로 전환한다.
- completed는 전체 필수 lecture 이수 시에만 전환한다.
### constraints
- 환불 가능 기간 이후 refund_enrollment를 제한한다.
- canceled 상태는 진도 업데이트를 허용하지 않는다.

## progress
### states
- not_started
- in_progress
- completed
### action
- start_lecture
- update_progress
- complete_lecture
- recalculate_course_progress
### rules
- 진도는 enrollment가 active 이상일 때만 기록한다.
- 강의 완료가 누적되면 코스 진행률을 재계산한다.
- 모든 필수 강의 완료 시 completed로 전환한다.
### constraints
- 진행률 값은 단조 증가를 기본 정책으로 적용한다.
- 사용자별 progress 레코드는 course+lecture 조합에서 유일해야 한다.

## category
### states
- active
- hidden
### action
- create_category
- update_category
- hide_category
- reorder_category
### rules
- hidden 카테고리는 기본 탐색 목록에서 제외한다.
- 코스는 최소 1개 카테고리에 매핑되어야 한다.
- 정렬 순서 변경은 전체 카테고리 순번 충돌 없이 반영한다.
### constraints
- 카테고리 이름은 동일 부모 내 중복 불가다.
- 순환 참조 부모-자식 구조를 금지한다.

## cart
### states
- empty
- active
- checked_out
- expired
### action
- add_item
- remove_item
- apply_coupon
- clear_cart
- checkout_cart
### rules
- cart 항목은 중복 course를 허용하지 않는다.
- checkout 성공 시 checked_out으로 전환하고 항목을 고정한다.
- 만료된 cart는 결제를 진행할 수 없다.
### constraints
- 가격 계산은 서버 기준으로만 확정한다.
- 할인 적용 순서는 정책(쿠폰 -> 최종 합계)으로 고정한다.

## coupon
### states
- inactive
- active
- exhausted
- expired
### action
- create_coupon
- activate_coupon
- validate_coupon
- redeem_coupon
- expire_coupon
### rules
- 유효기간과 사용 가능 횟수를 모두 만족할 때만 적용 가능하다.
- 사용자별 사용 제한이 있는 경우 중복 사용을 차단한다.
- 소진 임계치 도달 시 exhausted로 전환한다.
### constraints
- 할인율은 0~100 범위로 제한한다.
- 정액 할인은 주문 금액을 음수로 만들 수 없다.

## certification
### states
- unavailable
- eligible
- issued
- revoked
### action
- check_eligibility
- issue_certificate
- revoke_certificate
- reissue_certificate
### rules
- completed enrollment 사용자만 eligible 상태가 된다.
- 발급 시점의 사용자명/코스명 스냅샷을 보존한다.
- revoked 인증서는 검증 API에서 유효하지 않음을 반환한다.
### constraints
- issued 인증서는 고유 검증 식별자를 가져야 한다.
- 재발급은 이전 인증서 이력을 보존해야 한다.

## notification
### states
- queued
- sent
- failed
- read
### action
- enqueue_notification
- send_notification
- retry_notification
- mark_as_read
### rules
- 도메인 이벤트 발생 시 구독된 사용자에게 알림을 생성한다.
- 실패 알림은 재시도 정책에 따라 queued로 복귀한다.
- 사용자는 본인 알림만 읽음 처리할 수 있다.
### constraints
- 동일 이벤트 중복 발송은 멱등 키로 방지한다.
- 읽음 처리 시간은 서버 시간을 기준으로 기록한다.
