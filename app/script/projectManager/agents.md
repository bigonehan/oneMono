# 운영 가이드

## 핵심 파일
- `main.ts`: `createPaneAndRun()`을 호출해 현재 tmux 세션에 새 pane을 띄우는 단순 엔트리 포인트입니다.
- `src/tmux.ts`: tmux 제어 유틸입니다. pane 생성/키 입력뿐 아니라 최초 도구 호출 시 현재 pane을 “manager” 로 고정해 파일(`.tmux-manager-pane`)에 저장합니다.
- `src/grist.ts`: Grist 테이블을 다루는 CLI입니다. `bun src/grist.ts <command>` 형식으로 실행하며 state 파일(`.grist-cli.json`)을 기반으로 프로젝트/테이블을 기억합니다.

## Grist CLI 기본 사용법
1. **초기화** – `bun src/grist.ts init <tableId> <projectId>`로 작업할 테이블과 프로젝트를 저장합니다.
2. **조회** – `bun src/grist.ts list` 또는 `bun src/grist.ts read --limit 5`로 현재 프로젝트의 레코드를 확인합니다.
3. **작업 등록** – 새 작업을 시작할 때 `bun src/grist.ts insert --item "<제목>" --description "<무엇을 하는지>" [--status <코드>]`.
4. **상태 갱신** – 작업 완료 시 `bun src/grist.ts update --id <rowId> --status done --done true [--description "<결과 요약>"]`.
5. **current 관리** – `bun src/grist.ts current sync`로 다음 ID를 동기화하거나 `current show`로 확인합니다.

## tmux + Grist 워크플로
1. `bun main.ts`로 기본 pane 템플릿을 띄우거나 MCP 도구로 새 pane을 생성합니다.
2. 새 작업을 시작할 때 pane을 열고 동시에 Grist에 로그를 남깁니다.
3. 작업이 끝나면 row를 완료 처리하고 manager pane으로 결과를 보고합니다.

## MCP 도구 요약
- `tmux_create_pane`: 단순히 pane을 만들고 명령을 실행합니다.
- `tmux_create_logged_pane`: pane을 만들고 `item/description` 정보를 Grist에 즉시 기록합니다. 응답에 pane ID와 row ID가 포함됩니다.
- `grist_complete_task`: Grist row를 완료 상태로 업데이트합니다 (`--status`, `--done`, `--description` 선택).
- `tmux_send_keys`, `tmux_list_panes`, `tmux_list_sessions`, `tmux_kill_pane`, `tmux_capture_pane`: 기존 tmux 관리용 도구.

## 권장 흐름
1. `tmux_create_logged_pane` 호출 → agent pane 생성 + Grist row 기록.
2. 작업 수행 → 필요한 tmux 도구 활용.
3. 완료 시 `grist_complete_task`로 row 업데이트 후 `tmux_kill_pane` 등으로 정리.
