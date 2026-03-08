# info
name: web/next
description: monorepo template package
spec: auto
goal: init

# rules
- 최소 변경으로 commentdelete action 경로를 구현한다.
- 기존 comments API 패턴과 Next app router 구조를 재사용한다.
- 최소 변경으로 commentcreate action 초기화 경로를 유지/보강한다.

# constraints
- delete entrypoint must be wired from comment list UI
- only author or admin can delete
- deletion must be soft delete
- failed cases must return consistent code format
- keep existing init goal and avoid unrelated edits

# features
- commentread: post detail 화면에서 댓글 조회/초기 렌더/추가 페이지 병합
- commentupdate: 댓글 내용 수정 요청의 유효성/권한 검증 후 업데이트
- commentdelete: 댓글 삭제 요청의 유효성/권한 검증 후 소프트 삭제
- commentreply: 답글 입력/생성 요청을 검증하고 parent 댓글 하위로 렌더링
- commentcreate: 댓글 생성 요청의 입력/인증/살균 검증 후 저장 및 UI 즉시 반영

# implementation
- add: lib/comment-db.ts
- add: app/api/posts/[postId]/comments/route.ts
- add: app/post/[postId]/page.tsx
- add: app/post/[postId]/comments-client.tsx
- add: app/actions/commentupdate.ts
- add: app/actions/commentupdate.schema.ts
- add: app/actions/commentupdate.steps.ts
- add: app/actions/commentupdate.test.ts
- add: src/app/actions/commentdelete.ts
- add: src/app/actions/commentdelete.test.ts
- add: app/actions/commentreply.ts
- add: app/actions/commentreply.schema.ts
- add: app/actions/commentreply.steps.ts
- add: app/actions/commentreply.test.ts
- add: app/api/comments/[parentId]/replies/route.ts
- edit: app/api/comments/[commentId]/route.ts
- edit: app/api/posts/[postId]/comments/route.ts
- edit: app/actions/index.ts
- edit: app/post/[postId]/comments-client.tsx
- edit: lib/comment-db.ts
- edit: app/actions/commentcreate.ts
- edit: app/actions/commentcreate.schema.ts
- edit: app/actions/commentcreate.steps.ts
- edit: app/actions/commentcreate.test.ts
- edit: package.json
- edit: app/post/page.tsx
- edit: app/globals.css
- edit: feature.yaml
- edit: info.yaml

# checks
- npm run lint
- npm run check-types
- pnpm test
