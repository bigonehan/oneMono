# Desktop Astro + Tauri Template Plan

## 목표
- `template/desktop/astro`에 Astro + Tauri 기반 데스크톱 템플릿을 만든다.
- UI는 `@ui/shadcn`를 사용한다.
- 리스트 화면에서 `추가` 버튼을 누르면 `@features/editor` 기반 에디터가 열린다.
- 내부 저장소는 SQLite를 사용한다.
- 데이터/타입 개념은 `@domain/user`, `@domain/article`를 따른다.

## 범위
- 새 템플릿 패키지 생성: `template/desktop/astro`
- Tauri 기본 러너 + SQLite 명령 추가
- Astro 페이지 + React 컴포넌트 통합
- Playwright e2e 1개 이상
- `feedback.md` 작성

## 구현 단계
1. 도메인 최소 분해(`build_domain` 규칙 적용) 및 체크리스트 작성
2. 템플릿 스캐폴드 작성(Astro + React + Tauri)
3. SQLite 접근 계층(tauri-plugin-sql)과 article CRUD 최소 구현
4. UI 연결(list + add button + editor modal)
5. Playwright 실행 및 실패/개선점 기록
6. `feedback.md` 작성 후 개선 항목 반영(필요 시 plan 갱신)

## 반복 루프 규칙
- 한 루프 = 구현 -> Playwright -> feedback 정리
- 개선 항목이 있으면 `plan.md`에 다음 루프 항목을 추가하고 다시 수행
- 종료 조건: 기본 흐름이 테스트에서 통과
  - 트리거 입력(추가 버튼)
  - 핸들러 호출
  - SQLite 저장
  - 리스트 재반영

## 루프 이력
### Loop 1 (완료)
- 구현: desktop template + tauri/sqlite + editor/list 연결
- 검증: Playwright `add button -> editor -> save -> list update` 통과
- 결과: 기본 프로그램 형태 충족

### Loop 2 (후속 개선 후보)
- 목표: Tauri 런타임 기반 SQLite E2E 추가
- 목표: article update/delete UI + 테스트 확장
