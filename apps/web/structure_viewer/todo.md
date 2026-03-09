# problem
현재 `structure_viewer` 앱 디렉터리가 비어 있다.
현재 작업 디렉터리를 기준으로 모노레포 루트와 `domains` 또는 `domain` 폴더를 탐색하고, 파일/함수 구조를 시각적으로 확인할 수 있는 Astro 기반 앱 초안을 만들어야 한다.
초기 UI는 PixiJS에서 사각형 카드 안에 모듈명과 그 아래 함수 목록이 펼쳐지는 화면까지 동작해야 한다.

# tasks
- `orc-cli-workflow` 순서로 `.project/project.md`, `.project/plan.yaml`, `input.md`, `.project/drafts.yaml`을 생성한다.
- ORC 구현 결과를 바탕으로 Astro, Zustand, PixiJS, React Three Fiber 의존성과 초기 구조 뷰 UI가 연결되었는지 확인한다.
- 현재 폴더 기준으로 모노레포 루트 및 `domains|domain` 폴더를 찾는 로직과 파일/함수 목록 제공 흐름을 확인한다.
- `@ui/shadcn` 사용 가능 여부를 확인하고, 있으면 기존 컴포넌트를 우선 활용한다.
- 검증 실패 시 `feedback.md`를 반영해 재시도한다.
- 재시도에서는 긴 요구사항 문자열을 tmux pane에 직접 보내지 않고, 짧은 `orc` 인자 또는 로컬 `input.md` 기반 단계 명령으로 분리 실행한다.
- 강제 실행 항목: 실패 단계마다 새 worker pane을 열고, 단계 완료 여부는 `.project/*`, `input.md`, `feedback.md` 파일 생성으로 판정한다.
- tmux worker가 정체되면 동일한 `orc` 단계를 현재 셸에서 직접 실행해 출력과 종료 코드를 확보한 뒤 다음 단계로 진행한다.
- `orc clit test` 실패 원인인 Rust CLI 바이너리 부재를 해결하기 위해 `cargo run -- --help`가 통과하는 실행 진입점을 추가한다.
- CLI 실행 시 현재 작업 디렉터리 기준 모노레포 루트 탐색, `domains|domain` 폴더 탐색, 웹서버 시작 흐름을 실제 코드로 연결한다.
- UI 자동 검증을 위해 discovery API 호출, Zustand 저장, Pixi 카드 렌더, 함수 리스트 반영 경로를 실행 기반으로 확인한다.

# check
- `orc init_code_project -a "<요구사항>"`
- `orc init_code_plan -a`
- `orc create_input_md`
- `orc add_code_draft -a`
- `orc impl_code_draft`
- `orc clit test -p . -m "structure viewer initial build verification"`
- `orc check_code_draft -a`
