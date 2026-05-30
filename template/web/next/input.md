# commentcreate
- 기존 commentcreate action 초기화 경로를 유지하고 최소 변경으로 보강한다.
- 댓글 생성 요청에서 입력값, 인증, 살균 검증을 수행하고 실패 시 일관된 코드 형식으로 반환한다.
- 기존 comments API 패턴과 Next app router 구조를 재사용하고 저장 후 UI를 즉시 반영한다.
> post detail 댓글 입력 UI에서 commentcreate action을 호출한다.
> 검증 통과 시 저장하고 갱신된 댓글 상태를 즉시 렌더링한다.

# commentupdate
- 댓글 수정 요청에서 입력 유효성과 수정 권한을 검증한 뒤 내용 업데이트를 수행한다.
- 기존 comments API 패턴과 Next app router 구조를 재사용하며 최소 변경으로 구현한다.
- 실패 케이스는 기존 액션들과 동일한 코드 형식으로 반환한다.
> post detail 댓글 항목에서 수정 요청을 action으로 전달한다.
> 검증 통과 시 댓글 내용을 업데이트하고 목록 렌더 상태를 동기화한다.

