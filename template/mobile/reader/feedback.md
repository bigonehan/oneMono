# feedback

# 문제
- FlashList v2 타입 정의에서 `estimatedItemSize`가 허용되지 않아 타입체크가 실패했다.
- React Native Elements `ListItem.Chevron`에 `color` prop 타입이 맞지 않아 타입체크가 실패했다.
- Expo web export는 `react-dom`, `react-native-web`, `@expo/metro-runtime`이 없어 중단됐다.
- `pnpm exec expo install`은 내부적으로 `bun add`를 호출했고 현재 환경에 `bun`이 없어 설치에 실패했다.
- web export 재시도에서는 `package.json`의 `main`이 `node_modules/expo/AppEntry.js`라 pnpm 경로에서 `../../App`를 해석하지 못해 실패했다.
- `main`을 `expo/AppEntry`로 바꿔도 Expo package 내부의 동일 AppEntry를 사용해 pnpm 해석 문제가 계속 남았다.
- Maestro CLI 설치는 시스템 `java`가 없어 시작 단계에서 중단됐다.

# 미해결점
- FlashList 화면을 현재 설치 버전의 유효한 props 기준으로 수정해야 한다.
- Chevron 스타일을 타입 안전한 방식으로 바꿔야 한다.
- web export 의존성을 추가한 뒤 다시 번들 검증을 실행해야 한다.
- web 의존성 설치는 `expo install` 대신 `pnpm add`로 수행해야 한다.
- Expo 엔트리는 pnpm 환경 호환을 위해 `expo/AppEntry`로 바꿔야 한다.
- pnpm 환경에서는 로컬 `index.js`에서 `registerRootComponent`와 `./App`를 직접 연결해야 한다.
- Maestro 실제 실행은 Java 런타임이 준비된 뒤 재시도할 수 있다.

## entry-1773056989
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=1) | attempt=1 | create_input_md completed | add_code_plan failed: add_code_plan failed: timeout after 600s | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773056991
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=2) | attempt=2 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773056993
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=3) | attempt=3 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773056995
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=4) | attempt=4 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773056997
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=5) | attempt=5 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773056999
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=6) | attempt=6 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057001
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=7) | attempt=7 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057003
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=8) | attempt=8 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057005
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=9) | attempt=9 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057007
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=10) | attempt=10 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057009
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=11) | attempt=11 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057011
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=12) | attempt=12 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057013
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=13) | attempt=13 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057015
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=14) | attempt=14 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057017
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=15) | attempt=15 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057019
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=16) | attempt=16 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057021
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=17) | attempt=17 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057023
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=18) | attempt=18 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057025
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=19) | attempt=19 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057027
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=20) | attempt=20 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057029
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=21) | attempt=21 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057031
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=22) | attempt=22 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057033
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=23) | attempt=23 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057035
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=24) | attempt=24 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057037
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=25) | attempt=25 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0

## entry-1773057039
- status: failed
- summary: auto retry unresolved
- detail: auto retry unresolved (attempt=26) | attempt=26 | create_input_md failed: failed to execute create_input_md: No such file or directory (os error 2) | add_code_plan failed: failed to execute add_code_plan: No such file or directory (os error 2) | add_code_draft failed: failed to execute add_code_draft: No such file or directory (os error 2) | impl_code_draft failed: failed to execute impl_code_draft: No such file or directory (os error 2) | check_code_draft failed: failed to execute check_code_draft: No such file or directory (os error 2) | planned=2 worked=0 complete=1 error=0
