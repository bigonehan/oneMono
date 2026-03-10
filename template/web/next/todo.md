# problem
랜딩 페이지 템플릿에 반응형 navbar/라우팅(main, profile, qa)과 각 페이지별 UI 섹션, qa 채팅 토글, profile 카드 캐러셀+badge, main hero/carousel/feature/footer 구성이 필요하다. 또한 UI는 `@ui/shadcn`을 우선 사용하고 부족한 컴포넌트는 해당 패키지에 추가해야 한다.

재시도 실패 원인: `.project/drafts.yaml`에 누적된 무관 draft가 포함되어 `impl_code_draft`가 타임아웃 반복됨.

# tasks
- 실패 원인 해결: `.project/drafts.yaml`을 백업 후 랜딩 페이지 요구사항만 담긴 새 plan/draft로 재생성한다.
- 강제 실행 항목: `orc add_code_plan -m "landing page routing and sections"`로 기능 범위를 고정한 뒤 `orc add_code_draft -a`를 다시 실행한다.
- `orc impl_code_draft`를 재실행해 main/profile/qa UI 구현을 완료한다.
- 구현 결과에서 `next/app` 라우팅(main/profile/qa)과 navbar 로그인 아이콘, 반응형 동작을 점검한다.
- `@ui/shadcn` 컴포넌트 사용 여부를 확인하고 누락 시 `packages/ui/shadcn`에 최소 컴포넌트를 추가한다.
- UI 동작 경로(트리거 -> 핸들러 -> 상태 변경 -> 화면 반영)를 `rg`와 테스트/빌드 명령으로 검증한다.

# check
- `npm --prefix next run lint`
- `npm --prefix next run check-types`
- `npm --prefix next run build`
- `rg -n "main|profile|qa|navbar|hero|carousel|feature|chat|badge" next/app next/lib packages/ui/shadcn -S`
