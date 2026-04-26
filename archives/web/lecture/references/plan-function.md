# edge-backed-lecture
- input: `web/lecture` dev 실행, course/user/detail 조회 요청
- output: `server/lecture` NestJS 백엔드가 Gel DB 데이터로 응답하고 프론트가 이를 표시
- scope: 서버 분리, Gel schema/migration, NestJS DB 연동, web dev 동시 실행, 기본 조회/테스트
- verify: server build/test, Gel migration 적용, web build, dev 실행 시 백엔드 자동 실행과 데이터 응답 확인
