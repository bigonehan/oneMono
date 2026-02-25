## 문제 정의
- 요청: `three` 패키지에 `character` 기능을 추가하고, PC/모바일 입력으로 캐릭터 이동 + 점프를 구현한다.
- 추가 요청: `camera/third.ts`를 만들어 캐릭터 뒤를 따라가는 3인칭 카메라 로직을 구현한다.

## 요구사항 분해
1. PC 입력: `WASD` 이동
2. 모바일 입력: 화면 조이스틱 이동 (외부 라이브러리 사용 가능 시 사용)
3. 점프: PC `Space`, 모바일 단일 터치
4. 카메라: 캐릭터 후방 추적

## 해석 가정(모호성 처리)
- `three package`는 모노레포 UI 계층 신규 패키지 `packages/ui/three`로 생성한다.
- `character란 패키지`는 별도 워크스페이스가 아니라 `@ui/three` 내부 `src/character` 모듈로 구현한다.
- 모바일 입력은 웹 터치 환경 기준으로 구현하며, 조이스틱은 `nipplejs`를 사용한다.

## 현재 컨텍스트
- `packages/ui`에는 `gsap`, `motion`, `shadcn`, `storybook`가 있고 `three` 패키지는 없다.
- 루트 `.project` 제약 파일(`tasks/todos`)에는 추가 강제 조건이 없다.

## 변경 원칙
- 최소 변경: 신규 패키지 추가 + 필요한 export/기능목록/완료로그만 반영
- 기존 앱/기능 코드 리팩터링 없음

## 검증 방법
- 루트 타입검증: `bun run check-types`
- 완료 확인 기준:
  - `@ui/three`에서 캐릭터 컨트롤러/카메라 로직을 import 가능
  - 이동/점프/카메라 추적 로직이 타입 오류 없이 빌드 가능
