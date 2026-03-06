# problem
- template/desktop/astro를 VSCode 유사 사이드바 + Google 로그인 자동화 버튼이 있는 Tauri 앱으로 구현한다.
- 상태관리는 Zustand를 사용하고, 내부 자동화는 Playwright로 처리한다.

# tasks
- 기존 desktop astro 템플릿 구조 확인 후 최소 파일 변경 범위 확정
- Zustand 상태 스토어와 UI 컴포넌트 구현
- Tauri command에서 Playwright 스크립트 실행 연결
- info.yaml/feature.yaml 및 완료 로그 갱신

# check
- bun run --filter template-desktop-astro check-types
- bun run --filter template-desktop-astro test:e2e (가능하면)
- bun run --filter template-desktop-astro dev 기동 확인
- rg로 UI 트리거 -> 핸들러 -> 내부 함수 호출 경로 점검
