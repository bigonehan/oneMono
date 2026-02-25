## 도메인
- 주체: 3D 씬 사용자(PC/모바일)
- 중심 객체: 캐릭터 Transform(position/rotation), 입력 상태, 카메라
- 상태: 정지/이동/점프
- 동작: 입력 기반 이동 + 점프 + 후방 추적 카메라

## 흐름 (1차 이터레이션)
- 상태변화:
  - PC: WASD 입력으로 XZ 평면 이동, Space로 점프
  - 모바일: 조이스틱 벡터로 이동, 화면 터치로 점프
- 도메인간 상호작용:
  - `character` 모듈이 입력을 물리 업데이트로 변환
  - `camera/third.ts`가 캐릭터 ref를 받아 카메라를 후방 보간 추적
- 가능한 동작:
  - 입력 수집(키보드/터치/조이스틱)
  - 캐릭터 이동/회전/중력/점프
  - 3인칭 카메라 위치 보정 + lookAt

## 컨텍스트
- 기술 스택: React + TypeScript + three + @react-three/fiber
- 외부 라이브러리: `nipplejs`(모바일 조이스틱)
- 패키지 구조: `packages/ui/three/src/{character,camera}`
- `.project` 반영: 강제 task/rule 없음

## 제약조건
- 변경 범위는 신규 `packages/ui/three`와 기능 기록 파일로 제한
- 과도한 물리 엔진 도입 없이 단순 중력/점프 로직 사용

## 구현 단계
1. `@ui/three` 패키지 골격(`package.json`, `tsconfig.json`, `feature.yaml`, `src/index.ts`) 생성
2. `src/camera/third.ts`에 3인칭 카메라 추적 함수/훅 구현
3. `src/character/character_controller.tsx`에 PC/모바일 입력 + 이동/점프 구현
4. export 정리 및 타입검증
5. `funcion.yaml`/`.agents/log.md` 기능 완료 기록

## 검증
- 명령: `bun run check-types`
- 완료 기준:
  - `@ui/three` import 가능
  - 캐릭터 컨트롤/카메라 추적 타입 오류 없음

## 다음 이터레이션
- 물리엔진(cannon/rapier) 연동
- 카메라 충돌 회피/줌 제어
- 모바일 점프 제스처 세분화
