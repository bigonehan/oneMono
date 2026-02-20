## Port Ownership Override
- `packages/ports/*` 레이어는 사용하지 않는다.
- 포트 인터페이스는 각 도메인 패키지에서 직접 관리한다.
- 파일 규칙: `packages/domains/<domain>/src/<domain>_port.ts`
- 소비자는 `@domain/<domain>`에서 포트 타입을 import 한다.
