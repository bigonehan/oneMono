## 2026-02-16 - 헤더 모바일 햄버거 사이드메뉴 적용
- 모바일(767px 이하)에서만 햄버거 아이콘이 노출되도록 정리
- 햄버거 클릭 시 좌측 슬라이드 사이드 메뉴/오버레이가 열리도록 구현
- 오버레이 클릭과 메뉴 링크 클릭 시 닫힘 동작 추가
- `bun run check-types` 검증 완료

## 2026-02-16 - user/task table 도메인-포트-어댑터 흐름 추가
- `packages/domains/{user,task}`, `packages/ports/{user,task}`를 생성해 CRUD 모델/계약을 분리함.
- `packages/infras/gel-client`, `packages/adapters/user-gel`을 추가해 gel 기반(in-memory) user/task 생성 및 join row 조회를 구현함.
- Header에 `Table` 메뉴를 추가하고, next 템플릿에서 클릭 시 user와 연관 task를 생성해 TanStack Table로 렌더링되도록 연결함.
- 검증: `bun run --cwd packages/adapters/user-gel test`, `bun run --cwd template/web/next check-types` 통과.

## 2026-03-08 - commentupdate 액션 경로 구현
- `app/actions/commentupdate.ts|schema.ts|steps.ts` 경로를 기준으로 입력 검증/권한 확인/업데이트 파이프라인을 유지하고 `PATCH` 호출 경로를 연결함.
- `app/api/comments/[commentId]/route.ts`에 `PATCH` 핸들러를 추가해 `commentupdate` 액션을 통해 `commentId`/`content` 수정 요청을 처리하도록 구성함.
- `app/actions/commentupdate.test.ts` 실패/성공 케이스를 포함한 검증을 실행해 content/updatedAt 갱신 흐름을 확인함.
- 검증: `pnpm test` 통과, `pnpm lint`/`pnpm check-types`는 기존 `commentcreate.steps.ts` 파싱 오류로 실패.

## 2026-03-08 - commentread 액션/댓글 조회 경로 추가
- `app/actions/commentread*` 파일을 추가해 입력 규칙(page/append 모드)과 실행 스텝을 정의하고 액션 엔트리를 노출함.
- `GET /api/posts/[postId]/comments`를 `commentread` 실행 경로로 연결해 비로그인 조회 200 응답, page 단위 조회, JSON 응답을 통합함.
- `app/post/[postId]/page.tsx`에서 서버 렌더 시 `page=1` 댓글을 주입하고, 클라이언트 추가 요청은 `page>=2`로 이어붙이도록 유지함.
- 검증: `npm run test`, `npm run lint`, `npm run check-types` 통과.

## 2026-03-08 - commentdelete 액션/삭제 UI 경로 추가
- `src/app/actions/commentdelete.ts`를 기준으로 `commentId` 입력 검증, 인증/권한(본인 또는 admin) 검증, 소프트 삭제 결과 포맷을 통일함.
- `app/post/[postId]/comments-client.tsx`에서 삭제 버튼과 확인 모달을 추가하고 `requestCommentDelete` 호출 뒤 성공 시 목록에서 즉시 제거되도록 연결함.
- `src/app/actions/commentdelete.test.ts`를 추가해 `invalid_id`, `unauthorized`, `forbidden`, `not_found`, `deleted` 케이스를 검증함.
- 검증: `pnpm exec tsx --test src/app/actions/commentdelete.test.ts` 통과, `pnpm test`/`pnpm lint`는 기존 `app/actions/commentcreate.steps.ts` 파싱 오류로 실패.

## 2026-03-08 - commentcreate 댓글 작성 UI/API 연결 보완
- `app/post/[postId]/comments-client.tsx`에 댓글 작성 폼을 추가해 1~500자 및 trim 기준 공백-only 입력을 클라이언트에서 차단하고 POST 요청을 연결함.
- `app/actions/commentcreate.steps.ts`의 sanitize 정규식을 수정해 `<script>/<style>` 및 HTML 태그 제거를 일관되게 적용함.
- `app/actions/commentcreate.test.ts`에 0자 입력 거부와 비인증 요청 거부 케이스를 추가해 제약 검증 범위를 확장함.
- 검증: `pnpm test`, `pnpm exec tsx --test app/actions/commentcreate.test.ts` 통과. `pnpm lint`, `pnpm check-types`는 기존 경고/타입 오류로 실패.

## 2026-03-08 - commentread draft_item 제약 반영
- `app/api/posts/[postId]/comments/route.ts`의 GET 실행 연결에서 `page>=2`를 `append` 모드로 분기해 추가 요청 입력 규칙을 런타임 경로에 반영함.
- 비로그인 조회 200, postId 기반 조회/정렬(createdAt 오름차순), page 단위(최대 20) 응답, SSR/ISR 초기 주입, 추가 페이지 병합 흐름이 기존 구현과 함께 유지되는 것을 재확인함.
- 검증: `pnpm test` 통과, `pnpm lint`는 기존 `app/actions/commentcreate.steps.ts:41` 파싱 오류로 실패.

## 2026-03-08 - commentdelete draft_item 구현 검증
- `src/app/actions/commentdelete.ts` 기준으로 `commentId` 정규식 검증, 요청자 인증/권한(본인 또는 admin), 대상 조회/소프트삭제 결과를 일관된 반환 포맷으로 확인함.
- `app/post/[postId]/comments-client.tsx` 삭제 버튼 -> 확인 모달 -> `requestCommentDelete` 호출 -> 성공 시 목록 제거, 실패 시 코드별 메시지 처리 경로를 점검함.
- `app/api/comments/[commentId]/route.ts`의 `DELETE` 핸들러에서 `executeCommentDelete`와 `commentDb.findById`/`commentDb.softDeleteById` 연결을 확인함.
- 검증: `pnpm exec tsx --test src/app/actions/commentdelete.test.ts` 통과, `pnpm test` 통과, `pnpm lint`는 기존 `app/actions/commentcreate.steps.ts:41` 파싱 오류로 실패.

## 2026-03-08 - commentreply draft_item 구현 검증
- `app/actions/commentreply.ts|schema.ts|steps.ts`와 `lib/comment-reply.ts` 경로에서 입력 검증, 부모 댓글 확인, `parentId` 포함 저장 로직 연결을 확인함.
- `app/post/[postId]/comments-client.tsx`의 답글 버튼 클릭 -> 입력 폼 노출 -> 등록 submit -> `POST /api/comments/[parentId]/replies` 호출 -> 목록 상태 갱신 -> 부모 하위 렌더링 흐름을 확인함.
- `app/api/comments/[parentId]/replies/route.ts`에서 `commentreply` 액션 호출과 `commentDb.create({ parentId: input.parentId, ... })` 저장 경로를 확인함.
- 검증: `rg -n "commentreply" app lib src`, `pnpm test`, `pnpm lint` 통과.

## 2026-03-08 - commentupdate draft_item DB 연결 보완
- `app/actions/commentupdate.ts|steps.ts`에 repository 주입 경로를 추가해 동일한 검증 파이프라인(입력 -> 작성자 권한 -> 업데이트)을 라우트별 저장소에 재사용 가능하게 정리함.
- `lib/comment-db.ts`에 `updateById`와 `updatedAt` 저장을 추가해 `PATCH /api/comments/[commentId]`가 파일 기반 DB를 실제로 갱신하도록 보완함.
- `app/api/comments/[commentId]/route.ts`에서 `commentDb` 어댑터를 `commentupdate` 액션에 주입해 요청자=작성자 검증 후 업데이트 결과를 반환하도록 연결함.
- 검증: `pnpm test` 통과, `pnpm lint` 통과, `pnpm check-types`는 기존 코드베이스 전반 타입 오류로 실패.

## 2026-03-08 - commentreply draft_item UI/호출 경로 연결
- `app/post/[postId]/comments-client.tsx`에 댓글별 `답글` 버튼, 답글 입력 폼, `POST /api/comments/[parentId]/replies` 제출 핸들러를 추가해 사용자 입력 기반 트리거를 연결함.
- 댓글 목록을 부모/자식 구조로 렌더링하도록 분기해 `parentId`가 있는 답글이 부모 댓글 하단에 표시되도록 구현함.
- `app/globals.css`에 답글 폼/리스트 스타일을 최소 확장해 기존 댓글 UI 구조 안에서 답글 흐름이 표시되도록 반영함.
- 검증: `rg "commentreply"` 호출 경로 확인, `pnpm test` 실행, `pnpm lint` 실행 결과 보고.

## 2026-03-08 - commentupdate draft_item 인라인 수정 UI/PATCH 흐름 완성
- `app/post/[postId]/comments-client.tsx`에 `수정` 버튼, 인라인 편집 textarea, `저장/취소` 동작을 추가해 댓글 수정 트리거/핸들러/UI 반영 흐름을 연결함.
- 저장 시 `PATCH /api/comments/[commentId]` 요청으로 서버 액션 경로(`app/api/comments/[commentId]/route.ts` -> `app/actions/commentupdate.ts` -> `app/actions/commentupdate.steps.ts` -> `lib/comment-db.ts:updateById`)를 타고 상태를 갱신하도록 구성함.
- `app/actions/commentupdate.schema.ts`에 `commentId` 정규식 검증을 추가하고 `app/actions/commentupdate.test.ts`에 invalid id 실패 케이스를 확장함.
- 검증: `rg -n "commentupdate" app`, `rg -n "saveEdit|PATCH|commentupdate|updateById" ...`, `pnpm test`, `pnpm lint` 통과. `pnpm check-types`는 기존 타입 오류로 실패.

## 2026-03-08 - commentcreate draft_item 경계 검증 보강
- `references/plan-function.md`, `./.project/project.md`에 `commentcreate` 범위/규칙/체크 항목을 추가해 init 기준 설계 게이트를 최신화함.
- `app/api/posts/[postId]/comments/route.ts`에서 JSON body가 비객체(`null`, 원시값)인 경우 즉시 `400 invalid payload`를 반환하도록 보강해 POST 경로 런타임 예외를 차단함.
- `app/actions/commentcreate.test.ts`에 `500`자 경계 허용 케이스를 추가해 길이 제한(1..500) 조건을 테스트로 고정함.
- 검증: `pnpm exec tsx --test app/actions/commentcreate.test.ts`, `pnpm test`, `pnpm lint` 통과. `pnpm check-types`는 기존 타입 오류로 실패.
