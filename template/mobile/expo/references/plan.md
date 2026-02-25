## 도메인
- 주체: Codex 에이전트 운영 지침 관리자
- 중심 객체: AGENTS.override / SKILL 지시 문구
- 상태: 완료 후 tmux 오픈 강제 지시 존재 여부
- 동작: 완료 후 tmux 오픈 강제 지시 제거

## 흐름 (1차 이터레이션)
- 상태변화: AGENTS.override에서 완료 후 tmux 오픈 지시를 삭제하면, 작업 완료 시 tmux 창 오픈 강제가 사라진다.
- 도메인간 상호작용: AGENTS.override(전역 운영 규칙)와 skill(절차 규칙) 중 요청 조건("작업 완료 후")에 해당하는 부분만 수정한다.
- 가능한 동작: 파일 확인, 최소 삭제 편집, 재검색 검증.

## 컨텍스트
- 기술 스택: Markdown 지시 문서 관리
- 재사용 가능한 것: 기존 섹션 구조 유지
- 스타일 패턴: 불필요한 리포맷 없이 필요한 라인만 제거

## 제약조건
- 작업 완료 후 tmux 창 오픈 지시만 제거
- 스킬의 구현 시작 전 tmux 관련 문구는 요청 범위 밖이면 유지
- 최소 변경 원칙 준수

## 검증
- 완료 기준: AGENTS.override/skill 점검 후 "작업 완료 후 tmux 창 오픈" 지시가 더 이상 존재하지 않으면 완료.
- 검증 명령: `rg -n "완료.*tmux|tmux.*완료|complete.*tmux|tmux.*complete" /home/tree/ai/codex/AGENTS.override.md /home/tree/ai/skills/plan-code/SKILL.md`

## 다음 이터레이션
- 필요 시, "구현 시작 전 tmux" 문구도 정책적으로 제거할지 사용자 확인 후 별도 수정
