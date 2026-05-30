# info
name : feature_reader_expo_app_3_reader_view_nation_song_md_subject_domain_usecase_zustand
description : @feature 도메인에서 reader 도메인을 사용해 화면에 글자를 타이핑 효과로 보여주는 Expo 앱. 3개 화면(파일목록/Reader View/설정), nation_song md(애국가) 생성, subject domain usecase 사용, Zustand 상태관리
spec : expo, react native, typescript, zustand, react navigation, markdown
path : /home/tree/home/template/mobile/reader

# features
- workspace_bootstrap
- nation_song_markdown_seed
- file_list_screen
- reader_view_typing_effect
- settings_screen
- subject_domain_usecase_integration
- zustand_state_management
- react_navigation_three_screen_flow

# rules
- 전체 구현은 Expo + React Native + TypeScript 스택을 기준으로 유지한다.
- 화면 구조는 파일목록, Reader View, 설정의 3개 화면으로 고정한다.
- Reader View의 텍스트 렌더링은 타이핑 효과(점진 출력)로만 동작한다.
- markdown 파일 로딩/파싱/렌더링 흐름은 단일 진입 usecase를 통해 호출한다.
- 도메인 상태 변경은 Zustand store action을 통해서만 수행한다.
- React Navigation 라우트 이름은 상수로 관리하고 하드코딩 문자열 중복을 금지한다.
- nation_song(애국가) markdown은 앱 내 기본 데이터로 항상 접근 가능해야 한다.
- UI 로직은 화면 컴포넌트에 최소화하고 도메인/usecase 계층으로 위임한다.

# constraints
- TypeScript strict 모드 기준에서 타입 오류가 없어야 한다.
- 오프라인 환경에서도 기본 nation_song markdown 읽기가 가능해야 한다.
- Reader View는 긴 텍스트에서도 프레임 드랍 없이 동작해야 한다.
- 타이핑 속도/자동재생 등 설정값은 앱 재진입 시 복원 가능해야 한다.
- markdown 렌더링 실패 시 앱 크래시 없이 에러 상태를 표시해야 한다.
- 파일 목록에 표시되는 문서는 markdown 확장자만 허용한다.
- 상태 저장 구조는 화면 간 이동 시 일관성을 유지해야 한다.

# domains
## workspace
### states
- 초기화 전
- 의존성 설치 완료
- 개발 실행 가능
### action
- Expo 프로젝트 초기화
- 필수 라이브러리 설치(expo, react navigation, zustand, markdown 렌더러)
- 기본 폴더/파일 구조 준비
### rules
- 워크스페이스 설정은 모바일 실행 기준으로 구성한다.
- 개발/빌드 명령은 문서화된 스크립트만 사용한다.
### constraints
- iOS/Android 양쪽에서 실행 가능한 설정만 허용한다.
- 런타임에 필요한 리소스는 프로젝트 내부에서 해결 가능해야 한다.

## markdown_repository
### states
- 문서 없음
- nation_song 문서 준비됨
- 문서 로드됨
- 문서 로드 실패
### action
- nation_song markdown 생성
- markdown 파일 목록 조회
- markdown 원문 읽기
### rules
- nation_song 문서 식별자는 고정된 키로 관리한다.
- 문서 메타데이터(제목, 경로, 생성일)는 목록 표시용으로 유지한다.
### constraints
- markdown 소스는 UTF-8 인코딩을 사용한다.
- 허용 확장자는 `.md`로 제한한다.

## file_list_screen
### states
- idle
- loading
- loaded
- empty
- error
### action
- 초기 목록 요청
- 항목 선택 후 Reader View 이동
- 새로고침
### rules
- 목록 화면은 문서 제목과 식별자를 함께 표시한다.
- 선택 이벤트는 navigation + selectedDocument 상태 업데이트를 동시에 수행한다.
### constraints
- 로딩/빈 상태/오류 상태 UI를 각각 분리해 표시한다.
- 목록 데이터가 없어도 화면은 정상 렌더링되어야 한다.

## reader_view
### states
- idle
- preparing
- typing
- paused
- completed
- error
### action
- 선택 문서 로드
- 타이핑 시작/일시정지/재개/완료
- 타이핑 속도 적용
- 처음부터 다시 재생
### rules
- 표시 텍스트 길이는 현재 타이핑 인덱스보다 길 수 없다.
- completed 상태에서는 전체 본문이 일치해야 한다.
- 문서 변경 시 이전 타이핑 타이머/인터벌을 정리한다.
### constraints
- unmount 시 타이머 누수를 허용하지 않는다.
- 잘못된 문서 입력 시 error 상태로 전이하고 크래시를 금지한다.

## settings
### states
- default
- edited
- saved
### action
- 타이핑 속도 변경
- 자동 시작 여부 변경
- 설정 저장/초기화
### rules
- 설정 변경은 즉시 store에 반영하고 Reader View가 구독해 적용한다.
- 허용 범위를 벗어난 속도값은 저장 전에 보정한다.
### constraints
- 설정값은 앱 재실행 후에도 복원 가능해야 한다.
- 숫자/불리언 타입 일관성을 유지한다.

## subject_domain
### states
- usecase_ready
- usecase_running
- usecase_success
- usecase_failure
### action
- loadReaderDocumentUsecase 실행
- buildReaderSessionUsecase 실행
- updateReaderSettingUsecase 실행
### rules
- 화면 레이어는 usecase 결과만 사용하고 저장소 세부 구현을 직접 참조하지 않는다.
- usecase 입력/출력 DTO는 명시 타입으로 고정한다.
### constraints
- usecase는 부수효과를 최소화하고 상태 변경 책임을 명확히 분리한다.
- 실패 결과는 에러 객체 대신 도메인 결과 타입으로 반환한다.

## app_navigation
### states
- list_route
- reader_route
- settings_route
### action
- 파일목록 -> Reader 이동
- Reader -> 설정 이동
- 설정 -> 이전 화면 복귀
### rules
- 라우트 파라미터는 타입드 네비게이션 정의를 따른다.
- Reader 진입 시 선택 문서 식별자가 없으면 진입을 차단한다.
### constraints
- 딥링크/잘못된 라우트 접근 시 안전한 기본 화면으로 폴백한다.
- 화면 전환 시 store 상태 무결성을 유지한다.

## zustand_store
### states
- uninitialized
- hydrated
- active
- persistence_error
### action
- 초기 상태 생성
- 문서 선택 상태 갱신
- Reader 진행 상태 갱신
- 설정 상태 갱신 및 영속화
### rules
- action 외 직접 상태 변경을 금지한다.
- selector 기반 구독으로 불필요한 리렌더를 줄인다.
### constraints
- 직렬화 가능한 값만 persisted store에 저장한다.
- hydrate 실패 시 기본값으로 복구하고 오류 상태를 기록한다.
