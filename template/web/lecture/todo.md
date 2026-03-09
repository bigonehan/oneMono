# problem
강의 메인과 연결 페이지가 백엔드 미실행 상태에서 `fetch failed`로 깨져 기본 탐색 흐름이 막힌다.

# tasks
- `src/lib/api.ts`와 페이지 호출 지점을 기준으로 실패 경로를 확인한다.
- 네트워크 요청 실패 시 lecture 템플릿 데이터로 대체 응답하는 최소 fallback 경로를 추가한다.
- 메인/소개/상세/사용자 페이지가 같은 API 헬퍼를 통해 fallback까지 연결되는지 점검한다.
- 실패 원인이 남으면 `feedback.md`에 기록하고 해당 원인을 막는 조치를 `todo.md`에 반영한 뒤 다시 검증한다.

# check
- `npm run build`
- `rg -n "queryGraphQL|buildFallbackResponse" src`
