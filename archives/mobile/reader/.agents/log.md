## 2026-03-09 - 모바일 md 리더 앱 구현
- Expo 기반 모바일 md 리더 앱에 4개 하단 탭(목록, 소개, 리더, 옵션)을 추가했다.
- Zustand 상태와 FlashList, React Native Elements UI, markdown 리더 화면을 연결했다.
- Maestro 시나리오 파일을 추가했고 타입체크와 Expo web export로 동작 경로를 검증했다.

## 2026-03-09 - 리더 분기 선택지와 인라인 설정 메뉴 추가
- Reader 화면에 `if>` 분기 선택지 버튼과 target header cursor 이동 로직을 추가했다.
- 리더 내부에서 폰트 스타일, 크기, 자동 재생, 속도를 바꾸는 설정 메뉴를 추가했다.
- 분기 parser 모듈과 검증 문서를 갱신했고 타입체크와 Expo web export를 다시 통과시켰다.

## 2026-03-09 - 예시 데이터 추가
- 시드 문서 목록에 `City Morning Note` 예시 데이터를 추가했다.
- `city_morning_note.md` 파일명과 테스트용 markdown 본문, 태그/설명을 함께 등록했다.
- 타입체크를 실행해 데이터 추가 후 컴파일 오류가 없는 상태를 확인했다.
