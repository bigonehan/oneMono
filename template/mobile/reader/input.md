# workspace_bootstrap
- Expo + React Native + TypeScript strict 기준으로 워크스페이스를 구성한다.
- iOS/Android 실행 가능 설정과 필수 라이브러리 설치 상태를 보장한다.
> Expo 프로젝트 초기화와 기본 폴더 구조를 준비한다.
> react navigation, zustand, markdown 렌더링 의존성을 설치하고 개발 실행 스크립트를 검증한다.

# nation_song_markdown_seed
- nation_song 문서는 고정 식별자와 UTF-8 `.md` 형식으로 기본 데이터에 포함한다.
- 오프라인 환경에서도 항상 접근 가능하도록 앱 내부 리소스로 유지한다.
> nation_song markdown 파일과 메타데이터(제목, 경로, 생성일)를 생성한다.
> markdown 저장소 초기화 시 기본 문서가 목록과 로드 대상에 포함되도록 연결한다.

# file_list_screen
- 파일 목록은 markdown 확장자 문서만 표시하고 제목과 식별자를 함께 노출한다.
- loading, empty, error 상태 UI를 분리하고 선택 시 navigation과 selectedDocument 갱신을 동시에 수행한다.
> 초기 진입 시 문서 목록 조회 usecase를 호출해 상태를 로딩에서 로드 결과로 전이한다.
> 항목 선택 시 선택 문서 상태를 저장하고 Reader View로 이동한다.

# reader_view_typing_effect
- Reader View 텍스트는 타이핑 효과로만 점진 출력하고 completed에서 원문과 동일해야 한다.
- 문서 변경·언마운트 시 타이머를 정리하고 오류 입력은 error 상태로 처리한다.
> 선택 문서 로드 후 preparing에서 typing으로 전이해 인덱스 기반 출력 루프를 시작한다.
> 일시정지·재개·처음부터 재생·완료 동작과 긴 텍스트 성능을 검증한다.

# settings_screen
- 타이핑 속도와 자동 시작 설정은 즉시 store action으로 반영하고 범위를 벗어나면 보정한다.
- 저장된 설정은 앱 재실행 후에도 숫자/불리언 타입 일관성으로 복원한다.
> 설정 화면에서 속도와 자동 시작 값을 편집하고 변경 즉시 상태를 갱신한다.
> 저장/초기화 동작으로 persisted 상태를 갱신하고 Reader View 반영을 확인한다.

# subject_domain_usecase_integration
- markdown 로딩·파싱·렌더링 흐름은 단일 진입 loadReaderDocumentUsecase를 통해 호출한다.
- 화면 계층은 저장소 구현을 직접 참조하지 않고 명시 DTO와 도메인 결과 타입만 사용한다.
> loadReaderDocumentUsecase, buildReaderSessionUsecase, updateReaderSettingUsecase를 정의한다.
> 각 화면은 usecase 결과로 상태를 전이하고 실패는 도메인 실패 결과로 표시한다.

# zustand_state_management
- 도메인 상태 변경은 Zustand action을 통해서만 수행하고 직접 변경을 금지한다.
- selector 기반 구독과 직렬화 가능한 persisted 구조로 hydrate 실패 시 기본값 복구를 지원한다.
> 초기 상태, 문서 선택, Reader 진행, 설정 갱신 action을 분리 정의한다.
> persistence hydrate 경로와 오류 상태 기록 경로를 구현해 화면 간 일관성을 유지한다.

# react_navigation_three_screen_flow
- 라우트 이름은 상수로 관리하고 타입드 네비게이션 파라미터를 강제한다.
- Reader 진입 시 문서 식별자 누락을 차단하고 잘못된 접근은 안전한 기본 화면으로 폴백한다.
> 파일목록, Reader View, 설정의 3개 화면 스택을 구성한다.
> 파일목록→Reader, Reader→설정, 설정→복귀 흐름과 상태 무결성을 검증한다.

