# problem
- 읽기 속도 설정 값이 커져도 reader 타이핑 속도가 빨라지지 않는다.

# tasks
- 읽기 속도 값을 실제 reader 딜레이로 변환하는 함수를 분리한다.
- 설정 화면과 reader 내부 설정 메뉴 문구를 현재 동작에 맞게 조정한다.
- 타입체크와 `rg` 흐름 점검으로 속도 설정 -> reader 반영 경로를 확인한다.

# check
- `pnpm exec tsc --noEmit` 성공
- `rg`로 속도 설정 값 -> 변환 함수 -> `setTimeout` 연결 확인
