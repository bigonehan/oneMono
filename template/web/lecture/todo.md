# problem
`/home/tree/home/template/server/lecture`에 Gel(EdgeDB) 기반 NestJS 백엔드를 별도 구축하고, `/home/tree/home/template/web/lecture`에서 해당 백엔드를 자동 실행/연동해 개발과 테스트가 가능해야 한다.

# tasks
- `references/plan-function.md`와 `./.project/project.md`에 Gel DB + 분리 서버 + web dev 연동 범위를 반영한다.
- `/home/tree/home/template/server/lecture`를 Gel project로 초기화하고 현재 도메인/객체를 스키마와 migration으로 관리할 수 있게 구성한다.
  기존 `lecture` 인스턴스 직접 연결이 실패했으므로 전용 신규 인스턴스(`lecture-backend`)를 생성해 project init에 사용한다.
- NestJS 백엔드가 Gel client를 통해 course, lecture, user, review, enrollment, progress, category, cart, coupon, certification, notification 데이터를 조회/저장하게 구현한다.
- `/home/tree/home/template/web/lecture`에서 백엔드 API를 사용하도록 endpoint와 dev 스크립트를 갱신한다.
- `web/lecture`의 `npm run dev`가 내부적으로 서버와 프론트를 함께 띄우도록 구성한다.
- 검증 중 실패하면 `feedback.md`를 갱신하고 원인별 수정안을 `todo.md`에 반영한 뒤 재시도한다.
  현재 실패 원인은 Gel wrapper가 빈 인자를 전달하는 부분이므로, 파라미터 없는 질의에서 인자를 생략하도록 수정한다.
  현재 추가 실패 원인은 Gel upsert 문법이므로, 카테고리/코스 저장은 존재 여부 조회 후 `insert`/`update` 분기로 재구성한다.

# check
- `gel project init --project-dir /home/tree/home/template/server/lecture --server-instance lecture-backend --non-interactive`
- `npm --prefix /home/tree/home/template/server/lecture install`
- `npm --prefix /home/tree/home/template/server/lecture run db:migrate`
- `npm --prefix /home/tree/home/template/server/lecture run build`
- `npm --prefix /home/tree/home/template/server/lecture run test`
- `npm install --workspaces=false --include-workspace-root=false`
- `npm run build`
- `npm run dev` 실행 후 백엔드와 프론트가 함께 올라오고 GraphQL/HTTP 호출이 Gel 데이터와 연결되는지 확인
