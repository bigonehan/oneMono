# info
name : lecture
description : 강의 사이트 설계 대비 구현 점검 및 누락 보완
spec : next js, react, typescript
path : /home/tree/home/template/web/lecture

# features
- node_package_workspace
- rust_cli_workspace

# rules
- 모든 구현은 Next.js + React + TypeScript 스택 기준으로 설계와 일치해야 한다.
- 강의 사이트 점검 목적에 맞게 기존 기능의 동작 확인과 누락 보완을 우선한다.
- 변경은 최소 단위로 수행하고, 기능 단위로 검증 가능한 형태를 유지한다.
- 워크스페이스 구조(node package workspace, rust cli workspace) 간 역할 경계를 명확히 유지한다.

# constraints
- 프로젝트 루트 경로(`/home/tree/home/template/web/lecture`)를 기준으로 작업 범위를 한정한다.
- 문서와 코드의 규칙은 프로젝트 공통 규칙과 도메인 규칙을 동시에 만족해야 한다.
- 불필요한 리팩터링, 형식 정리, 범위 외 변경을 금지한다.
- 점검/보완 작업은 기존 구조와 호환되어야 하며, 호환성 저하를 유발하면 안 된다.

# domains
## lecture_site
### states
- 초기 구조 정의됨
- 구현 점검 진행 중
- 누락 항목 식별됨
- 누락 보완 적용됨
- 점검 결과 확정됨
### action
- 강의 사이트 요구사항과 현재 구현을 대조한다.
- 누락된 UI/로직/연결 지점을 식별한다.
- 식별된 누락 항목을 최소 변경으로 보완한다.
- 보완 후 동작을 재검증하고 결과를 문서화한다.
### rules
- `##도메인 이름` 아래의 `### states`, `### action`, `### rules`는 모두 `-` 리스트 형식을 유지한다.
- 도메인 규칙은 프로젝트 공통 규칙과 충돌하지 않아야 한다.
- 점검 항목은 강의 사이트 핵심 흐름(표시, 상호작용, 연결)을 기준으로 작성한다.
### constraints
- 도메인 변경은 강의 사이트 목적 범위를 벗어나면 안 된다.
- 점검 과정에서 확인되지 않은 가정 기반 기능 추가를 금지한다.
- 보완 항목은 재현 가능한 근거(요구사항 또는 점검 결과)에 기반해야 한다.
