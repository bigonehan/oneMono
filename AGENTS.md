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

## 폴더/파일 네이밍 규칙 (Python 도메인)
- 새 파일 생성 전 반드시 대상 도메인을 먼저 식별한다.
- 파일은 반드시 `domains/{entity명}/` 디렉토리 내부에 배치한다.
- 새로운 도메인이 필요하면 `domains/{entity명}/` 디렉토리를 새로 생성한다.
- 기본 구조:
- `domains/{entity명}/{entity명}_entity.py` (도메인 엔티티)
- `domains/{entity명}/{entity명}_port.py` (포트 인터페이스)
- `domains/{entity명}/{entity명}_service.py` (서비스, in adapter)
- `domains/{entity명}/{entity명}_{기술명}.py` (기술 어댑터, in/out)
- suffix 규칙:
- `_entity`: 도메인 엔티티
- `_port`: 포트 인터페이스
- `_service`: 서비스(in adapter)
- `_{기술명}`: 기술 어댑터(in/out) 예: `user_rest.py`, `user_pg.py`, `user_kafka.py`
- `_entity`, `_port`를 제외한 나머지 파일은 모두 어댑터로 간주한다.
- 어댑터 파일명에는 `_adapter` suffix를 붙이지 않고 기술명을 suffix로 사용한다.

예시 (`user` 도메인):

```text
domains/
└── user/
    ├── user_entity.py
    ├── user_port.py
    ├── user_service.py
    ├── user_rest.py
    └── user_pg.py
```

## JJ Workspace 작업 규칙 (Mandatory)
- 구현/생성/개선 요청을 수행할 때는 코드 변경 전에 반드시 전용 `jj workspace`를 먼저 생성(또는 전환)한다.
- 코드 편집, 의존성 변경, 빌드/테스트 실행은 해당 작업용 `jj workspace`에서만 수행한다.
- 작업 완료 후 검증이 끝나면 기본 workspace로 변경사항을 반드시 merge 한다.
- merge 충돌 또는 merge 불가 상태가 발생하면 임의 우회하지 말고 즉시 사용자에게 확인한다.
- merge 완료 후에는 사용한 임시 workspace를 정리한다.

## Shell 사용 규칙
- 검색/필터/간단 치환은 `rg`, `rg --files`, `sd` 같은 직접 명령으로 먼저 처리한다.
- `rg` 중심의 직접 명령만으로 해결할 수 없을 때에만 `fish -ic` 또는 `bash -c`를 사용한다.
