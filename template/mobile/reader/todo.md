# problem
- npm workspace 충돌로 의존성 설치가 실패해 검증이 중단됐다.

# tasks
- [실패 원인 해결] `pnpm install`로 의존성을 설치한다.
- `pnpm exec tsc --noEmit`로 타입체크를 수행한다.
- `rg`로 UI 트리거->핸들러->유즈케이스->상태 반영 경로를 검증한다.
- 결과 정리 후 로그/알림을 완료한다.

# check
- `pnpm-lock.yaml`과 `node_modules` 생성
- `pnpm exec tsc --noEmit` 성공
- 연결 경로 `rg` 결과 확인
