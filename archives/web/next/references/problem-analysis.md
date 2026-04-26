## 문제 정의
- Next 앱 빌드에서 `@adapters/article-md` 엔트리 로딩 시 `Module not found: Can't resolve './article-md-adapter.js'` 오류가 발생한다.
- 원인은 `packages/adapters/article-md/src/index.ts`가 실제 소스(`article-md-adapter.ts`)와 불일치한 `.js` 확장자로 re-export하기 때문이다.

## 영향 범위
- `@adapters/article-md`를 import하는 모든 소비자에서 모듈 해석 실패 가능.
- 빌드/타입체크 단계에서 조기 실패한다.

## 해결 방향
- 최소 변경으로 `packages/adapters/article-md/src/index.ts`의 re-export 경로를 확장자 없는 상대경로로 수정한다.
- 로직/구조 변경은 하지 않는다.

## 검증 방법
- `npm run check-types` (in `/home/tree/home/template/web/next`)
- `npm run lint` (in `/home/tree/home/template/web/next`)
