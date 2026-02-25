## 문제 정의
- 요청: `AGENTS.override`와 스킬 문서를 확인한 뒤, "작업 완료 후 tmux 창을 열라"는 지시가 있으면 제거한다.

## 현재 확인 결과
- `/home/tree/ai/codex/AGENTS.override.md`에 구현/개선 완료 후 tmux pane을 열도록 강제하는 섹션이 존재한다.
- `/home/tree/ai/skills/plan-code/SKILL.md`의 tmux 문구는 "설계 완료 후 구현 시작 전" 조건으로, "작업 완료 후" 지시와는 다르다.

## 변경 원칙
- 최소 수정: 완료 후 tmux 오픈 강제 지시만 제거한다.
- 나머지 지시/규칙은 유지한다.

## 검증 방법
- 대상 파일에서 `tmux`/`pane`/`완료` 관련 문구를 재검색해 완료 후 tmux 오픈 지시가 제거되었는지 확인한다.
- 명령: `rg -n "tmux|pane|완료|complete" /home/tree/ai/codex/AGENTS.override.md /home/tree/ai/skills/plan-code/SKILL.md`
