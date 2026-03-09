# 구현 확인
- `/home/tree/home/template/server/lecture`를 Gel project로 초기화하고 로컬 인스턴스 `lecture-backend`를 생성했다.
- `.../lecture/dbschema/default.gel`에 user, category, course, lecture, review, enrollment, progress, coupon, cart, certification, notification 스키마와 기본 제약을 정의했다.
- `.../lecture/src/db/gel.service.ts`에서 Gel client 연결과 초기 seed를 구현했고, `.../lecture/src/graphql/lecture.service.ts`는 메모리 배열 대신 Gel 질의로 조회/저장을 수행하도록 교체했다.
- `.../lecture/package.json`에 `db:migrate`, Gel 기반 `start`/`start:dev`/`test` 스크립트를 추가했고 `.../lecture/package.json`은 `npm run dev` 시 `../../server/lecture` 백엔드와 Astro 프론트를 함께 실행하도록 갱신했다.
- 검증: `npm --prefix /home/tree/home/template/server/lecture run db:migrate`, `npm --prefix /home/tree/home/template/server/lecture run build`, `npm --prefix /home/tree/home/template/server/lecture run test`, `npm run build` 통과.
- 실행 검증: 백엔드 기동 후 `mainCourses`, `userPage` GraphQL 응답이 Gel 데이터에서 반환되는 것을 확인했고, `web/lecture`의 `npm run dev`로 메인/사용자/상세 페이지가 DB 데이터를 렌더하는 것을 확인했다.

# 발견된 문제
- 검증 중 Gel project 초기화에서 기존 인스턴스 직접 링크가 막혀 전용 인스턴스 `lecture-backend` 생성으로 우회했다.
- 검증 중 Gel wrapper의 빈 인자 전달 문제와 `registerTempStudy` upsert 문법 문제가 있었고, 각각 인자 생략 처리와 `insert`/`update` 분기 방식으로 수정했다.
