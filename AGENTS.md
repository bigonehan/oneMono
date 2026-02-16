# AGENTS.md

## Mandatory Pre-Read
- Before starting any task, read `/home/tree/ai/doc/guide.md`.
- If this file cannot be read, stop immediately and report it.

## Plan Mode Rule (Feature Work)
- In Plan mode, the first objective is:
  1. Ask for and confirm the feature scope and requirements.
  2. Create a plan file using the template at `/home/tree/ai/templates/plan.md`.
- The plan file must be created before any implementation work starts.
- Save the plan file at `./.agents/plan.md` (relative to the current working directory where Codex was invoked).
- Treat that plan file as the execution source of truth for subsequent task work and updates.
- If `/home/tree/ai/templates/plan.md` cannot be read, stop immediately and report it.

## Task Document Rule (Feature Addition/Improvement)
- When adding or improving features in already-existing packages/modules, you must first reference `/home/tree/ai/templates/feature.md`.
- Before writing any code, create `./.agents/task.md` in the current working directory based on that template.
- `./.agents/task.md` is mandatory in both Plan stage and implementation stage.
- No code implementation is allowed until `./.agents/task.md` is created and the task scope/rules/files are documented.
- All tasks must be completed by following `./.agents/task.md` as the execution checklist and source of truth.

## Version Control: Jujutsu (jj)
This project uses **Jujutsu (jj)** (Git-backed) as the primary local VCS workflow.

### 핵심 규칙
- 앞으로 기능 추가/수정 작업에서는 **jujutsu(jj) 사용을 필수**로 한다.
- **작업 단위(논리 분리)**: `jj new` 로 *change* 를 만들어서 분리한다.
- **환경/폴더 단위(물리 분리)**: `jj workspace` 로 *작업 디렉토리* 를 분리한다.

### 요구사항을 받았을 때: 의사결정
1. **작은 기능/버그 수정 (LOCALIZED)** -> `jj new` 만 사용한다.
- 파일/모듈 일부만 수정
- 빌드 시스템/의존성/폴더 구조 변경 없음
- 동일 워크스페이스에서 테스트/서버를 유지한 채 진행 가능

2. **전체 구조 리팩토링 (HIGH-RISK / STRUCTURAL)** -> `jj workspace` 를 사용한다.
- 폴더 이동/대량 rename/패키지 구조 재편
- 의존성/빌드 설정/툴체인 변경
- 포맷터/린터 대량 적용, 자동 마이그레이션
- 서버/빌드/테스트를 병렬로 유지해야 함 (기존 환경 보호 필요)

### Standard Flow (Small / Localized change)
1. 상태 확인
```bash
jj st
jj log -n 10
```

2. 작업 change 생성
```bash
jj new -m "feat(template-web-next): add base scaffold"
```
- 메시지는 Conventional-style(`feat|fix|refactor(scope): summary`)를 권장한다.

3. 구현/검증
- 코드 변경 후 프로젝트 규칙에 맞는 테스트/타입체크/린트를 실행한다.

4. 변경 확인
```bash
jj st
jj diff
```

5. 완료 시점 규칙 (Commit/Push)
- 작업 완료 후에는 변경을 명확한 단위로 확정(commit equivalent)한다.
- 기본 명령:
```bash
jj describe -m "feat(template-web-next): scaffold next template using @ui/shadcn"
```
- 원격 반영이 필요하면 trunk 기준으로 rebase 후 push한다.
```bash
jj git fetch
jj rebase -d trunk
jj git push
```
- PR 생성 전 최종 확인:
```bash
jj st
jj log -n 10
```

## Architecture Policy (Hexagonal, Default)
This monorepo follows **Hexagonal Architecture** by default.

### Core Rules
- Business logic lives in `packages/domains/*`.
- Port contracts live in `packages/ports/*` as independent packages.
- Adapter implementations live in `packages/adapters/*`.
- Domain layer must not depend on adapter/infrastructure details.
- Adapter layer must not contain business rules.

### Independent Implementation Units
All work should be handled as separate units:
1. `domain` implementation
2. `port` contract implementation
3. `adapter` implementation

Do not merge these responsibilities into a single package or single PR chunk unless explicitly requested.

### Dependency Direction
- Allowed:
  - `ports -> domains` (only for domain types needed by contracts)
  - `adapters -> ports`
  - `apps(composition) -> domains, ports, adapters`
- Forbidden:
  - `domains -> adapters`
  - `domains -> infrastructure/framework`
  - `ports -> adapters`

### Implementation Flow (Default)
1. Define or update domain concepts in `packages/domains/<domain>`.
2. Define or update Port interfaces in `packages/ports/<domain>`.
3. Implement concrete adapters in `packages/adapters/<domain>-<adapter>`.
4. Wire dependencies only at composition/integration layer.

### Standard Monorepo Folder Layout
Use the following structure unless the task explicitly requires otherwise:

- `packages/domains/<domain>/`
  - `src/models/` (entities, value objects, domain types)
  - `src/usecases/` (domain/application services)
  - `src/index.ts`
  - `tests/` (domain-level tests)
- `packages/ports/<domain>/`
  - `src/inbound/` (driving ports)
  - `src/outbound/` (driven ports)
  - `src/index.ts`
  - `tests/` (contract-level tests)
- `packages/adapters/<domain>-<adapter>/`
  - `src/` (port implementations)
  - `src/index.ts`
  - `tests/`
- `packages/apps/<app>/`
  - `src/composition/` (dependency wiring)
  - `src/main.ts` or framework entrypoint
- `packages/shared/` (cross-cutting utilities only, no domain leakage)

### Definition of Done
- Domain behavior is expressed and validated at domain level.
- Port contracts are explicit and versioned in `packages/ports/*`.
- Adapters implement Ports without leaking infra concerns into domain.
- Composition layer performs binding/injection; domain remains framework-agnostic.
- `domain`, `port`, and `adapter` changes are reviewable as independent concerns.

### Enforcement
- If a task conflicts with this flow, ask for explicit user approval before proceeding.
- Any PR or change that introduces forbidden dependency direction must be rejected.

### Working Rule for Agents
- When adding new code, work in this order: `domain -> port -> adapter -> composition`.
- Do not place business rules in adapters, controllers, repositories, or framework handlers.
