# problem
- `http://localhost:8081`에서 앱이 빈 화면으로 보이는 원인을 찾아 수정해야 한다.
- 웹 환경에서 seed 문서 초기화가 실패하지 않고 목록/리더 화면이 렌더되어야 한다.

# tasks
- `8081`에서 실제 실행 중인 프로세스와 앱 번들 상태를 확인한다.
- `fileSubjectRepository`의 seed 저장 로직을 웹에서도 동작하도록 fallback을 구현한다.
- 수정 후 타입체크와 웹 번들 실행으로 빈 화면 이슈 재현 여부를 확인한다.

# check
- `pnpm exec tsc --noEmit` 성공
- `pnpm exec expo start --web` 실행 시 번들 에러 없음
- 앱 초기화 시 seed 문서 로드 경로에서 예외 발생 없음
