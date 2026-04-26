# reader branch interaction

## input
- 리더 본문 markdown 문자열
- `if>문장 |선택지라벨>targetId` 형식의 분기 라인
- 현재 리더 설정 상태

## output
- 본문 표시용 일반 블록 목록
- 선택지 버튼에 필요한 분기 블록 정보
- 설정 메뉴 호출 여부와 현재 적용 값

## scope
- Reader 화면에 선택지 버튼 오버레이를 추가한다.
- Reader 화면에서 설정 메뉴를 열고 폰트 관련 값을 변경한다.
- `if>` 문법을 파싱하는 전용 md parser 모듈을 분리한다.
- 선택한 버튼의 `targetId`를 문서 내 header로 찾아 커서를 이동시킨다.

## check
- `pnpm exec tsc --noEmit`
- `pnpm exec expo export --platform web --output-dir dist`
- `rg`로 `if>` 파서 -> ReaderScreen 분기 처리 -> 선택지 버튼 -> cursor 이동 흐름 확인
