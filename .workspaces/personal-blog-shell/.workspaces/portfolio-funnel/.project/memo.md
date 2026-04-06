# 2026-03-09 상황 정리

- `tauri-doc-manager` 생성 및 Tauri 실행 검증을 진행했다.
- `rust-orc-desk`에서 서버 기동 코드를 이식하는 방향은 제외하고, Tauri 기본 런타임에서 해결하는 방향으로 정리했다.
- ORC 관련 최소 범위(templates/path 로딩, `.project/project.md`/`plan.yaml`/`drafts.yaml` 로딩, 병렬 실행 호출)만 이식 대상으로 확정했다.
- 시스템 패키지 업그레이드 과정에서 `glibc/libgcc_s/pam` 충돌이 발생해 복구 절차를 진행 중이다.

## 현재 상태
- 저장소에 다수 변경사항이 누적되어 있으며, 본 커밋은 현재 작업 상태를 보존하기 위한 스냅샷이다.
