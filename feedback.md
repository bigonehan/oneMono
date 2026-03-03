# Feedback - Desktop Astro + Tauri Template

## Loop 1 결과
- 구현 완료: `template/desktop/astro` 생성
- 검증 완료: Playwright e2e 1건 통과

## 검증 로그
- 타입체크: `bunx turbo run check-types --filter=template-desktop-astro` 통과
- e2e: `bun run test:e2e` 통과 (1 passed)
- 호출 경로 점검(`rg`):
  - 트리거: `data-testid="open-editor"` 버튼
  - 핸들러: `onClick={() => setEditorOpen(true)}`
  - 내부 로직: `saveArticle` -> `store.createArticle(...)`
  - 상태 반영: `setArticles(await store.listArticles())`
  - UI 재반영: `<ListArticle articles={articles} />`

## 발견된 이슈와 조치
- `@features/editor` 런타임 이슈: `EditorContent is not a function`
  - 조치: `createElement(EditorContent, { editor })`로 수정
- `@domain/article` 타입 import 경로 확장자 누락
  - 조치: `./usecases/create-article.js`로 수정

## 다음 루프 후보(개선점)
- Tauri 실제 런타임(e2e)에서 SQLite 파일 생성/조회까지 포함한 데스크톱 통합 테스트 추가
- article 수정/삭제 UI 버튼 추가 및 e2e 확장

## Loop 2 결과 (Reader 이슈 대응)
- 발견 이슈: `@features/reader` export 경로 `.js`가 Next 번들 해석에서 `Module not found`를 유발함.
- 원인: `NodeNext` 기반 패키지 export 규칙과 Next(Turbopack)의 워크스페이스 TS 소스 해석 방식 충돌.
- 조치:
  - `packages/features/reader/tsconfig.json`에 `module: ESNext`, `moduleResolution: Bundler` 적용
  - `packages/features/reader/src/index.ts` export를 확장자 없는 경로로 변경
- 결과: reader 관련 `Module not found` 해소.

## Loop 2 검증 로그
- 타입체크: `bun run --cwd packages/features/reader check-types` 통과
- 템플릿 타입체크: `bun run --cwd template/web/next check-types` 통과
- dev 서버 확인: `cd template/web/next && bunx next dev --port 3100` 실행 후 `GET / 200` 확인
- 참고: `next build`에서 별개 기존 이슈(`@domain/article`의 `create-article.js` 경로 해석) 존재
