# problem
- `template/web/donation` 패키지를 새로 만들고, 단일 페이지 모금 랜딩과 운영자 편집 화면을 함께 제공해야 한다.
- 메인 페이지에는 소개, 상세 설명, 진행률 표시, 모금 버튼이 필요하고 결제는 Stripe Checkout으로 연결되어야 한다.
- 운영자는 admin 화면에서 문구와 스타일 토큰을 수정하고, 변경 내용이 메인 페이지에 즉시 반영되어야 한다.
- 검증은 `rc` 기반 체크와 앱 자체 lint/typecheck/build, 실제 호출 경로 점검, 웹 리서치 기반 개선 루프까지 포함해야 한다.

# tasks
- `references/plan-function.md`와 `.../donation/.project/project.md`에 기능 범위와 검증 기준을 문서화한다.
- ORC workflow로 `init_orc_project -> init_orc_job -> init_orc_job -> add_orc_drafts -> impl_orc_code -> check` 순서를 실제 실행한다.
- 실패 원인 해결: `init_orc_job` 정체와 generic draft를 우회하기 위해 `job.md`를 수동으로 구체화하고 `add_orc_drafts -f`로 재생성한다.
- 강제 실행: `job.md`에는 소개/detail/progress CTA/Stripe webhook/admin editor/data persistence를 모두 명시한다.
- 실패 원인 해결: `impl_orc_code` 비수렴을 우회하기 위해 Next 패키지 파일과 서버/API 흐름을 직접 구현한다.
- 강제 실행: package/app/lib/store/data 파일을 직접 만들고 이후 검증 명령을 전체 재실행한다.
- 실패 원인 해결: `npm install` crash를 우회하기 위해 workspace package manager인 `bun install`로 의존성을 설치한다.
- 강제 실행: 설치/검증 명령은 `bun install`, `bun run lint`, `bun run check-types`, `bun run build` 기준으로 재실행한다.
- Next.js 템플릿 패키지 구조를 만들고 `@ui/shadcn`, `@features/editor`, Zustand를 우선 재사용해 donation landing/admin 흐름을 구현한다.
- Stripe Checkout 생성 API, webhook 처리, 진행률 데이터 저장, 운영자 편집 데이터 저장 경로를 연결한다.
- 실패 원인 해결: 기본 `drafts.yaml`가 로그인 폼 셀렉터를 강제하므로 donation 랜딩/관리 화면 기준 셀렉터로 시나리오를 교체한다.
- 강제 실행: landing/admin 주요 노드에 안정적인 `data-testid`를 추가하고 `rc`를 재실행해 페이지 구조 기준으로 검증한다.
- 실제 검증 보강: dev 서버를 띄운 뒤 admin 저장 API와 landing 렌더 반영을 HTTP 요청으로 확인하고 결과를 `job.md`에 누적한다.
- `rg`로 `UI 입력 -> 핸들러 -> 내부 로직 -> 상태/파일 변경 -> 화면 반영` 호출 경로를 점검한다.
- `npm run lint`, `npm run check-types`, `npm run build`, `rc` 체크, 필요 시 재시도 후 `job.md`에 보완점을 누적한다.

# check
- `cd /home/tree/home/template/web/donation && npm run lint`
- `cd /home/tree/home/template/web/donation && npm run check-types`
- `cd /home/tree/home/template/web/donation && npm run build`
- `cd /home/tree/home/template/web/donation && cargo run --manifest-path /home/tree/project/rust-orc/Cargo.toml --bin rc -- clit test -p . -m "donation template verification"`
- `cd /home/tree/home/template/web/donation && npm run dev`
- `curl http://127.0.0.1:3000`
- `curl -X PUT http://127.0.0.1:3000/api/admin/content -H 'Content-Type: application/json' --data @/tmp/donation-admin-payload.json`
- `rg -n "donate|checkout|webhook|admin|editor|progress|store|save|update" /home/tree/home/template/web/donation`
- 재시도 사유: `init_orc_job` hang -> `job.md` 수동 작성 후 `add_orc_drafts -f` 재실행
- 재시도 사유: `impl_orc_code` non-converging -> 수동 구현 후 전체 검증 재실행
- 재시도 사유: `npm install` workspace crash -> `bun install`로 설치 경로 전환
- 재시도 사유: 기본 `rc` web_login_check가 donation UI와 무관한 `.auth-card` 셀렉터를 요구함 -> donation 전용 draft로 교체 후 재검증
