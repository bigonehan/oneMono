# info

- name : codex-monorepo-workspace
- description : Codex에서 기능 설계, 초안 생성, 구현까지 수행하는 TypeScript 기반 Turborepo 모노레포
- spec : TypeScript, React, Next.js, Turbo, Bun, Workspace Packages
- goal : 기능 요청을 폴더 규칙과 단계 흐름에 맞춰 일관되게 설계하고 구현 가능한 상태로 유지

## rule

- 모든 기능은 먼저 `.project/project.md`에 설계로 기록한 뒤 구현 단계로 이동한다.
- 패키지 책임은 `apps`, `packages/domains`, `packages/features`, `packages/adapters`, `packages/infras`, `packages/ui` 경계 안에서만 분리한다.
- `packages/ports/*` 레이어는 사용하지 않고 도메인 포트는 `packages/domains/<domain>/src/<domain>_port.ts`에서 직접 소유한다.
- 신규 기능은 관련 패키지의 `feature.yaml`, `info.yaml`을 함께 갱신한다.
- 최소 변경 원칙을 적용하고, 기능과 무관한 리팩터링/포맷 변경은 금지한다.

## features
1. plan-project-code 실행 | `.project/project.md` 생성/수정 | 기능 구현 전 설계 기준 확정
2. feature 요구사항 입력 | `.project/project.md`의 `features`, `stage`, `step` 갱신 | 구현 대상과 흐름 고정
3. plan-drafts-code 실행 | `.project/features/work/<feature-name>/draft.yaml` 생성 | 기능별 구현 명세 확보
4. draft 기반 구현 실행 | `apps/*`, `packages/*` 대상 코드 파일 변경 | 기능 동작 추가/수정
5. 검증 명령 실행 | 타입/테스트/린트 명령 결과를 작업 기록에 반영 | 완료 기준 충족 여부 확인

## structure
- `.project/project.md` : 프로젝트 설계 원문. 사용 조건: 구현 시작 전 반드시 최신화한다.
- `.project/features/work/` : 기능별 draft 저장 경로. 사용 조건: `plan-drafts-code` 실행 시 feature별 하위 폴더를 생성한다.
- `.agents/log.md` : 완료 이력 문서. 사용 조건: 기능 추가 완료 시 날짜 기준으로 1개 레코드를 append 한다.
- `apps/web/` : 실행 앱(Next.js). 사용 조건: 사용자 UI/API 엔드포인트가 필요할 때만 수정한다.
- `packages/domains/<domain>/src/` : 도메인 모델/유스케이스/포트. 사용 조건: 비즈니스 규칙 변경 시 우선 수정한다.
- `packages/features/<feature>/src/` : 도메인 조합형 기능 단위. 사용 조건: 화면/유스케이스를 기능 묶음으로 제공할 때 사용한다.
- `packages/adapters/<adapter>/src/` : 도메인 포트 구현체. 사용 조건: 외부 저장소/API 연동이 필요할 때 생성/수정한다.
- `packages/infras/<infra>/src/` : 저수준 인프라. 사용 조건: 파일/DB/클라이언트 라이브러리 캡슐화가 필요할 때 사용한다.
- `packages/ui/*/src/` : 재사용 UI 컴포넌트. 사용 조건: 앱 전용이 아닌 공통 UI를 제공할 때 사용한다.
- `template/web/*`, `template/mobile/*` : 템플릿 프로젝트. 사용 조건: 신규 앱 템플릿 추가/수정 작업에서만 변경한다.
- `references/` : 설계 참고 문서. 사용 조건: 계획/문제 분석 문서를 갱신할 때 사용한다.

# Domains
### domain
- **name**: `project_planning`
- **description**: 기능 요구를 구조화된 설계 문서로 정리하는 도메인
- **state**: `drafting`, `reviewing`, `confirmed`
- **action**: `create_project_md`, `update_features`, `align_stage`
- **rule**:
  - `features`는 3~7개 범위로 유지한다.
  - 각 feature는 `명령 | 실행/변경 파일 | 파생 결과` 형식을 지킨다.
- **variable**:
  - `project_name`
  - `feature_list`
  - `stage_flow`

### domain
- **name**: `workspace_structure`
- **description**: 모노레포 폴더 책임과 경계를 관리하는 도메인
- **state**: `validated`, `violated`, `migrating`
- **action**: `validate_path`, `map_package_role`, `guard_port_ownership`
- **rule**:
  - 도메인 포트는 `packages/domains/<domain>/src/<domain>_port.ts`에 둔다.
  - `packages/ports/*` 신규 생성은 금지한다.
- **variable**:
  - `package_path`
  - `layer_type`
  - `owner_domain`

### domain
- **name**: `feature_delivery`
- **description**: draft 기반 구현과 검증 결과를 완료 상태로 수렴시키는 도메인
- **state**: `planned`, `implemented`, `verified`, `released`
- **action**: `generate_draft`, `apply_changes`, `run_checks`, `append_log`
- **rule**:
  - 구현 완료 시 검증 결과를 반드시 기록한다.
  - 기능 추가 완료 시 `.agents/log.md`에 이력을 append 한다.
- **variable**:
  - `draft_path`
  - `changed_files`
  - `verification_result`

# Stage
## stage list

1. 프로젝트 설계 문서 작성/갱신
2. feature 목록 확정
3. draft.yaml 생성
4. 코드 구현 및 파일 변경
5. 검증 실행과 완료 로그 기록

# UI
### codex session

- description: Codex 대화 기반으로 설계/구현/검증 명령을 수행하는 작업 화면
- flow: 요구 입력, project 문서 갱신, draft 전환, 구현, 검증 보고
- domain: project_planning, feature_delivery
- action: 설계 생성, feature 확정, draft 생성, 구현 실행, 검증 실행
- rule:
  1. 설계 미완료 상태에서는 구현 명령을 실행하지 않는다.
  2. 검증 실패 시 원인과 재실행 계획을 문서/응답에 남긴다.

# Step
## 프로젝트 설계
### project.md 생성/갱신

1. 사용자 요청으로 기능 목적과 범위를 수집한다.
2. `.project/project.md`를 생성하거나 최신 내용으로 갱신한다.
3. `features`, `structure`, `stage`를 요청 범위에 맞게 확정한다.

## 기능 초안
### draft 생성

1. 확정된 feature를 기준으로 `plan-drafts-code`를 실행한다.
2. `.project/features/work/<feature-name>/draft.yaml` 파일을 생성한다.
3. draft에 구현 파일 경로와 완료 조건을 명시한다.

## 구현 및 검증
### 코드 반영과 완료 처리

1. draft 대상 파일(`apps/*`, `packages/*`)을 수정한다.
2. 타입체크/테스트/린트 중 해당 기능의 검증 명령을 실행한다.
3. 기능 완료 시 `.agents/log.md`에 완료 이력을 append 한다.

# Constraints
## architecture

- 레이어 경계는 `apps -> features -> domains -> adapters/infras` 방향을 유지한다.
- 도메인 규칙 변경은 `packages/domains/*`를 우선 수정하고 UI는 후속 반영한다.
- 성능 최적화는 불필요한 워크스페이스 의존성 추가 금지를 기본으로 한다.

## quality

- 모든 기능 완료는 최소 1개 이상의 실행 기반 검증(타입/테스트/린트)을 포함한다.
- 검증 불가 항목은 사유와 미완 상태를 명시한다.

# Verification
- 상태: 미완
- 기준:
  - [도메인]이 [동작]했을 때 [결과]가 된다 형식의 검증 시나리오를 feature별로 추가한다.
  - 각 feature 완료 시 실행한 검증 명령과 결과를 기록한다.
