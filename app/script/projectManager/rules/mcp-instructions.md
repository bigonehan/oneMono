# MCP Workflow Rules

1. `plan.md`와 `rules/bootstrap.md`를 먼저 읽고 작업 전반을 이해한다.
2. 사용자가 `one:coding`이라고 입력하면 `one_coding` MCP 도구를 호출해 현재 작업 폴더의 `plan.md`를 바탕으로 pane/agent를 자동 생성한다. `workspace` 인자는 절대 경로로 전달한다.
3. 개별 작업 중에 추가 pane이 필요하면 `tmux_create_logged_pane`으로 생성해 Grist에 기록한다.
4. 작업 완료 후 `grist_complete_task`로 row를 완료 처리하고 `tmux_kill_pane`으로 agent pane을 정리한다.
5. 모든 로그와 요약은 `README.md` 혹은 지정된 상태 보고 위치에 기록한 뒤 종료한다.
