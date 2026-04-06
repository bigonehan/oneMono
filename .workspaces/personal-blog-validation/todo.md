# problem
- screen/rect capture 산출물이 Git 추적과 히스토리에 남아 업로드 용량을 키우고 있다.
- 앞으로 ORC 워크플로우에서도 캡처 산출물을 추적하지 않도록 규칙을 명시해야 한다.

# tasks
- 루트 `.gitignore`에 캡처 산출물 규칙을 추가한다.
- `orc-cli-workflow` 스킬 문서에 캡처 저장 위치와 비추적 규칙을 명시한다.
- 현재 추적 중인 `screen-capture.png`, `rect-capture.png`를 인덱스와 히스토리에서 제거한다.
- 임시 클론에서 체크아웃된 `main`으로 직접 fetch하지 않고, 현재 refs 상태 기준으로 캡처 히스토리 제거를 다시 실행한다.
- `git rev-list --objects --all`에 남은 캡처 blob을 포함하는 ref를 찾고, 누락된 namespace까지 다시 정리한다.

# check
- git ls-files | rg '(^|/)(screen-capture|rect-capture)\.png$'
- git rev-list --objects --all | rg '(^|/)(screen-capture|rect-capture)\.png$'
- git check-ignore -v apps/web/structure_viewer/screen-capture.png
- git fsck --full
