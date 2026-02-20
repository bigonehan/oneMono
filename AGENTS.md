# AGENTS.md

## 기능 추가/설계 전 사전 점검
- 기능 추가나 설계 전에 `packages/domain/` 또는 `packages/features/` 하위에 이미 같은 성격의 도메인/기능이 있는지 먼저 점검한다.
- 기존 구현이 있으면 우선 재사용/확장하고, 중복 생성은 피한다.

## UI 컴포넌트 처리 원칙
- UI 컴포넌트를 새로 만들기 전에 `packages/ui` 하위 패키지를 먼저 검사한다.
- 이미 있는 컴포넌트가 있으면 가급적 그것을 사용한다.
- 없으면 먼저 `packages/ui` 하위에 관련 라이브러리 기반 패키지를 만들고, 이후 앱에서 import 해서 사용한다.

## 기능 추가 완료 후 기록
- 신규 기능 추가가 끝나면 모노레포 루트의 `funcion.yaml`에 추가된 기능을 반영한다.
- 이때 자신이 속한 패키지 이름 아래 리스트 항목으로 기능을 추가한다.

## 기능 약어 규칙
- `funcion.yaml`에는 기능 설명을 압축하기 위해 도메인명 뒤에 약어를 붙인다. 예: `user_crud`
- 약어 의미:
- `crud`: `create/read/update/delete`(생성/조회/수정/삭제)
- `c`: `create`(생성)
- `r`: `read`(조회, 목록 포함)
- `u`: `update`(수정)
- `d`: `delete`(삭제, 제거 포함)
- 조회/목록/단건처럼 세부 read 성격은 필요 시 `list`, `get`을 추가로 사용한다. 예: `task_list`, `user_get`

## Port 배치 규칙
- 공용 `packages/ports/*` 패키지는 사용하지 않는다.
- 각 포트 인터페이스는 해당 도메인 패키지 내부에서 관리한다.
- 파일명 규칙: `packages/domains/<domain>/src/<domain>_port.ts`
- 외부 패키지는 `@domain/<domain>`에서 포트 타입을 import 한다. (예: `import type { UserPort } from "@domain/user"`)

## Usecase 네이밍 규칙
- 도메인 usecase 파일명은 도메인 접두사 기반 snake_case를 사용한다.
- 파일명 패턴: `packages/domains/<domain>/src/usecases/<domain>_<action>.ts`
- 예시: `user_create.ts`, `user_get.ts`, `user_list.ts`, `user_update.ts`, `user_delete.ts`
