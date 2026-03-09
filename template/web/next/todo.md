# problem
랜딩 페이지 템플릿에 반응형 navbar/라우팅(main, profile, qa)과 각 페이지별 UI 섹션, qa 채팅 토글, profile 카드 캐러셀+badge, main hero/carousel/feature/footer 구성이 필요하다. 또한 UI는 `@ui/shadcn`을 우선 사용하고 부족한 컴포넌트는 해당 패키지에 추가해야 한다.

# tasks
- `orc` 단계(`init_code_project -> init_code_plan -> create_input_md -> add_code_draft -> impl_code_draft`)를 실행해 요구사항 기반 구현을 생성한다.
- 구현 결과에서 `next/app` 라우팅(main/profile/qa)과 navbar 로그인 아이콘, 반응형 동작을 점검한다.
- `@ui/shadcn` 컴포넌트 사용 여부를 확인하고 누락 시 `packages/ui/shadcn`에 최소 컴포넌트를 추가한다.
- UI 동작 경로(트리거 -> 핸들러 -> 상태 변경 -> 화면 반영)를 `rg`와 테스트/빌드 명령으로 검증한다.

# check
- `npm --prefix next run lint`
- `npm --prefix next run check-types`
- `npm --prefix next run build`
- `rg -n "main|profile|qa|navbar|hero|carousel|feature|chat|badge" next/app next/lib packages/ui/shadcn -S`
