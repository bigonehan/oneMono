# 문제
- `npm --prefix game run lint`에서 Next ESLint patch 오류(`calling module was not recognized`)가 발생했다.
- `npm --prefix game run build`에서 `three` 타입 선언 누락으로 TypeScript 에러가 발생했다.

# 미해결점
- ESLint 버전/설정이 Next 15 lint 경로와 맞지 않는다.
- `@types/three`가 없어 `import * as THREE from "three"` 타입체크가 실패한다.
