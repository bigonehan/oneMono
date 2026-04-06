# 문제

# 해결
- 기존 `.project` 이력 때문에 `orc auto -> init_orc_job`와 초기 `add_orc_drafts -m`이 현재 스폰서 작업 대신 이전 draft를 잡던 문제를 `plan.yaml`/`job.md` 정리와 `add_orc_drafts -f` 재진입으로 해소했다.
- `orc impl_orc_code`가 소스 변경 없이 LLM wait만 반복하던 문제는 직접 구현으로 전환해 실제 페이지/스타일/테스트 변경을 완료했다.
- 워크스페이스 검증 경로에서 빠져 있던 의존성은 `npm install --legacy-peer-deps`와 워크스페이스 루트 `react`/`react-dom` 보강으로 복구했다.
- `astro check`를 막던 기존 `WriteArticleForm.tsx`의 React 19 타입 호환 문제는 `SafeArticleEditor` 래퍼로 최소 수정해 해결했다.
- Playwright sponsor 테스트의 strict mode locator 실패는 헤더 nav 범위로 locator를 좁혀 해결했다.
- `orc clit test -p . -m "blog sponsor landing verification"`는 기본 웹 포트 3000 가정 때문에 현재 Astro 앱(4321)에서 재현되지 않아, 동일 실행 검증을 `npm run dev -- --host 127.0.0.1` + `curl` + Playwright로 대체했다.

#개선필요
- 기존 `.project` 이력이 남아 있는 템플릿에서는 `orc auto` 전체 루프보다 기능 범위를 좁힌 `add_orc_drafts -f` 재진입 경로를 먼저 점검한다.
- jj workspace에서 앱 단위 검증을 돌릴 때는 `node_modules` 유무와 워크스페이스 루트/앱 로컬 설치 위치를 먼저 확인한다.
- UI 테스트 locator는 중복 텍스트 가능성을 먼저 보고 범위를 좁혀 strict mode 실패를 줄인다.
