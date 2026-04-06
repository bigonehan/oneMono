# 문제

# 해결
- `template/web/landing`의 lint 실패는 `eslint@10.0.3` 조합 문제였고, `package.json`을 `eslint@^9.39.1`로 맞춘 뒤 `bun install` 재실행으로 해소했다.
- `template/web/landing`은 hero, features, workflow, proof로 이어지는 실제 랜딩 section 구조와 store-backed interaction panel로 재구성했다.
- `template/web/astro`는 placeholder full-height section 나열을 hero, operations board, workflow, proof, close 흐름으로 재구성했다.
- `npm --prefix template/web/landing run lint`, `npm --prefix template/web/landing run build`, `bun --cwd template/web/astro run check-types`, `bun --cwd template/web/astro run build`를 모두 통과했고, 두 템플릿 모두 dev 서버와 `curl`로 새 section 문구 노출을 확인했다.

#개선필요
- `template/web` 하위 템플릿들은 UI 개선과 별개로 공통 검증 도구 버전을 한 번 정리할 필요가 있다.
