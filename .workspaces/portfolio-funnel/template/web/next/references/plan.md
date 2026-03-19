## 도메인
- 주체: Next 앱 개발자/빌드 시스템
- 중심 객체: `@adapters/article-md` 공개 API 엔트리(`src/index.ts`)
- 상태: 잘못된 re-export 경로(`.js`) -> 정상 경로(확장자 없음)
- 동작: export 경로 2줄을 최소 수정

## 흐름 (1차 이터레이션)
- 상태변화: 엔트리 export 경로를 `.js`에서 확장자 없는 경로로 변경하면 모듈 해석 오류가 사라진다.
- 도메인간 상호작용: 앱이 `@adapters/article-md` import 시 엔트리에서 내부 adapter 파일 해석이 성공해야 한다.
- 가능한 동작: `packages/adapters/article-md/src/index.ts`의 export/type export 경로만 수정.

## 컨텍스트
- 기술 스택: Next 16 + TypeScript + workspace package import
- 재사용 가능한 것: 기존 `article-md-adapter.ts` 파일 유지
- 스타일 패턴: 경로 문자열만 수정

## 제약조건
- 최소 변경(1파일)
- 리팩터링/추가 기능/포맷 정리 금지

## 검증
- 완료 기준: `./article-md-adapter.js` 해석 오류가 재현되지 않는다.
- 명령: `npm run check-types`, `npm run lint` in `/home/tree/home/template/web/next`

## 다음 이터레이션
- 필요 시 다른 workspace 패키지 엔트리의 `.js` re-export 경로 점검
