# 문제

# 해결
- fresh `jj workspace`에서 `node_modules/.bin/next`가 비어 `orc clit test -p . -m "ui audit capture"`가 실패했지만, workspace 루트 `bun install`로 런타임 바이너리를 복구한 뒤 캡처를 다시 통과시켰다.
- `app/page.tsx`와 `app/globals.css`를 갱신해 sticky section nav, first-fold quick donate rail, proof strip, organizer updates, impact callout, checkout 재구성을 반영했다.
- `bun run lint`, `bun run check-types`, `bun run build`, `bun run dev`, `orc clit test -p . -m "donation ui improvement verification"`를 모두 통과했다.
- 런타임 경로 검증으로 `PUT /api/admin/content -> saveCampaignContent -> data/campaign-content.json 변경 -> / 재렌더`를 실제 실행으로 확인했고, 검증 직후 원본 콘텐츠를 복구했다.

#개선필요
- 사용자가 지적한 전체 `template/app` 디자인 범위를 확장하려면 같은 기준으로 다른 웹 템플릿과 앱형 화면에도 reference-driven audit를 순차 적용하는 것이 좋다.
