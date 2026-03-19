# node_package_workspace
- `template/web/donation`은 Next.js App Router 패키지로 만들고 워크스페이스 import 규칙을 유지한다.
- 공용 UI는 `@ui/shadcn`, 편집 기능은 `@features/editor`, 상태는 Zustand를 우선 사용한다.
- 환경변수와 파일 저장 경로 외 하드코딩된 외부 의존 경로를 만들지 않는다.
> 패키지 기본 설정과 워크스페이스 의존성을 연결한다.
> Next build/lint/typecheck가 가능한 패키지 골격을 만든다.

# donation_landing_page
- 메인 화면은 단일 페이지 랜딩으로 hero 소개, detail 섹션, progress bar, donate CTA를 포함한다.
- 진행률은 목표 금액 대비 현재 모금액과 donor 수를 명확히 표시한다.
- 모바일에서도 CTA와 핵심 정보가 우선 노출되도록 반응형 레이아웃을 유지한다.
> 저장된 campaign content와 donation state를 로드한다.
> 소개/detail/progress/donate 패널을 한 페이지에서 렌더링한다.
> 상태 메시지와 success/cancel 결과를 화면에 반영한다.

# stripe_checkout_webhook_flow
- 기부 버튼은 Stripe Checkout Session을 생성해 Stripe 결제로 이동해야 한다.
- webhook 완료 이벤트가 누적 모금액, donor 수, 최근 기부 내역을 파일 기반 상태에 반영해야 한다.
- 같은 session id는 한 번만 집계하고, 환경변수가 없으면 명확한 오류를 반환해야 한다.
> 선택 금액 또는 직접 입력 금액으로 checkout session을 생성한다.
> Stripe webhook signature를 검증한다.
> 결제 완료 후 donation state json을 idempotent하게 업데이트한다.

# admin_copy_theme_editor
- admin route에서 운영자가 소개 문구, detail 문구, CTA 문구, 목표 금액, 색상 토큰을 수정할 수 있어야 한다.
- 편집 저장 후 landing 페이지가 같은 파일 데이터를 읽어 변경 내용이 즉시 반영되어야 한다.
- rich text 편집은 `@features/editor`를 사용하고, 부족한 입력 UI는 로컬로 구현한다.
> admin page에서 현재 content/theme 데이터를 로드한다.
> Zustand store로 편집 상태를 유지하고 저장 API를 호출한다.
> 파일 저장 후 landing 재조회 시 반영 결과를 확인한다.

# validation_feedback_loop
- 검증은 lint, typecheck, build, `rc` 체크, `rg` 호출 경로 점검을 모두 포함한다.
- 웹 리서치로 donation landing page의 trust signal, progress 표현, CTA 배치 기준을 확인하고 부족한 점을 `feedback.md`에 누적한다.
- 문제가 남으면 원인과 수정안을 문서화한 뒤 다시 구현/검증을 반복한다.
> 구현 후 정적 검증과 실행 기반 검증을 수행한다.
> 호출 경로와 화면 반영 경로를 `rg`로 추적한다.
> 리서치 기반 개선점을 `feedback.md`에 기록하고 필요한 수정을 재반영한다.
