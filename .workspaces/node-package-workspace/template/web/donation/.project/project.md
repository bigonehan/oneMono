# info
name : donation
description : Donation landing template with Stripe checkout progress and admin editor
spec : nextjs,typescript,zustand,stripe,shadcn
path : /home/tree/home/template/web/donation

# features
- workspace_bootstrap
- donation_landing_page : hero 소개, impact detail, progress bar, donate CTA > load content > render landing > open checkout
- stripe_checkout_progress : checkout session 생성, webhook 완료 처리, 누적 모금액 반영 > create session > confirm payment > persist raised total
- admin_content_editor : 운영자 문구/스타일 편집 및 저장 > load admin content > edit copy/theme > save json > reflect landing
# rules
- 랜딩 페이지는 단일 페이지 경험을 유지하되 admin 화면은 별도 route로 분리한다.
- 공용 UI는 `@ui/shadcn`을 우선 사용하고 부족한 UI만 로컬 구현한다.
- 결제 완료 누적치는 Stripe webhook 기준으로 반영한다.
- 스타일 토큰은 CSS 변수로 관리하고 admin 저장 데이터와 연결한다.

# constraints
- Stripe 비밀키, webhook secret, 사이트 URL은 환경변수로만 주입한다.
- 진행률 저장은 파일 기반 JSON으로 구현하되 webhook 이벤트 idempotency를 보장한다.
- build/lint/typecheck와 `rc` 검증이 통과해야 완료로 본다.

# domains
## landing_page
### states
- content_ready
- donate_idle
- donate_pending
### action
- render hero and detail sections
- show progress and presets
- trigger checkout request
### rules
- intro/detail/cta 텍스트는 저장된 content 데이터로 렌더한다.
- progress percent는 `total_raised / goal_amount`로 계산한다.
### constraints
- 모바일과 데스크톱 모두에서 CTA가 화면 안에 유지돼야 한다.

## checkout_progress
### states
- checkout_ready
- checkout_redirected
- webhook_processed
### action
- create checkout session
- verify webhook signature
- update donation totals
### rules
- 세션 생성은 최소 1달러 이상 금액만 허용한다.
- 같은 Stripe session id는 한 번만 누적 합산한다.
### constraints
- 환경변수가 없으면 명확한 에러를 반환한다.

## admin_editor
### states
- admin_loaded
- content_dirty
- content_saved
### action
- load content form
- edit copy and theme
- save content json
### rules
- 저장 후 landing 페이지 데이터 로더가 같은 파일을 읽어 즉시 반영한다.
- 소개/상세 문구와 색상 토큰은 개별 필드로 수정할 수 있어야 한다.
### constraints
- 운영자 저장은 서버 route를 통해 파일 쓰기로만 수행한다.
