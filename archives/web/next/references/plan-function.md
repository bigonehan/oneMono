# commentdelete plan

## scope
- implement `commentdelete` action path at `src/app/actions/commentdelete.ts`
- connect comment list delete trigger to action call in `app/post/[postId]/comments-client.tsx`
- keep delete request path on `DELETE /api/comments/[commentId]`
- reuse existing comment DB soft delete path in `lib/comment-db.ts`
- keep changes minimal and avoid unrelated refactor

## input_rules
- `commentId`: required non-empty string and `/^[a-zA-Z0-9_-]{3,128}$/`
- requester login id: required for authorized delete
- requester role: allowed when author or admin
- target comment: must exist and not already deleted

## input_steps
1. click `삭제` in comment item
2. show confirm modal (`정말 삭제하시겠습니까?`)
3. call action helper and send `DELETE /api/comments/[commentId]`
4. validate requester auth/permission in action path
5. execute soft delete in storage
6. return unified result and update comment list UI

## checks
- invalid id returns `invalid_id`
- unauthenticated requester returns `unauthorized`
- non-author requester returns `forbidden`
- missing target returns `not_found`
- delete success updates comment list UI immediately
- `pnpm test` and `pnpm lint` pass

# commentreply plan

## scope
- implement `commentreply` action path at `app/actions/commentreply.ts` with schema/steps pair
- add `POST /api/comments/[parentId]/replies` entry point and connect from comment list UI
- persist reply with `parentId` into comment storage and render under parent comment
- keep existing comment read/create path and only add required fields/handlers

## input_rules
- `parentId`: required non-empty string
- `postId`: required non-empty string
- `content`: required 1..500 chars and not blank after sanitize
- requester session: login id + display name required

## input_steps
1. click `답글` button under target comment
2. reveal reply input form for selected parent comment
3. submit `POST /api/comments/[parentId]/replies` with `postId`, `content`
4. validate payload and user in action handler
5. execute domain reply creator and persist with `parentId`
6. append created reply and render as child comment in UI

## checks
- `rg "commentreply"` shows action registration + API/UI call path
- `pnpm lint` and `pnpm test` run with pass/fail status reported
- UI flow verified: trigger -> handler -> domain logic -> storage update -> rerender

# commentcreate plan

## scope
- keep `commentcreate` action path on `app/actions/commentcreate.ts` with schema/steps validation
- keep create API on `POST /api/posts/[postId]/comments` and enforce auth + postId consistency
- keep comment create UI in `app/post/[postId]/comments-client.tsx` with 1..500 and trim validation
- persist created comment with required fields `author/content/postId/createdAt`
- keep changes minimal and avoid unrelated refactor

## input_rules
- `request.method`: must be `POST`
- `postId`: required non-empty path param and must match payload when provided
- `content`: required 1..500 chars and non-empty after trim + sanitize
- requester session: login id + display name required
- target post: must exist before comment create

## input_steps
1. user types into comment textarea
2. click `등록` and run client-side length/blank validation
3. send `POST /api/posts/[postId]/comments` with `{ postId, content }`
4. validate auth/session and input in API/action path
5. sanitize content and persist into comment DB
6. append created comment to UI state for immediate rerender

## checks
- unauthenticated request returns `401`
- content `0` or `501` length rejected
- whitespace-only content rejected
- script/tag payload stored as sanitized content
- success stores `author/content/postId/createdAt` and updates list immediately

# commentread plan

## scope
- keep read action entry on `app/actions/commentread.ts` and schema/steps pair
- keep read API on `GET /api/posts/[postId]/comments` with `page` query pagination
- keep post detail initial comment render via SSR/ISR path `app/post/[postId]/page.tsx`
- keep client append flow in `app/post/[postId]/comments-client.tsx` with page>=2 requests
- keep changes minimal and avoid unrelated refactor

## input_rules
- `postId`: required non-empty path param
- `page`: integer and `>= 1`, append mode requires `>= 2`
- unauthenticated read: allowed and returns `200` on valid request
- page size: max `20`
- comment order: `createdAt` ascending

## input_steps
1. enter post detail page
2. SSR/ISR initial read requests page `1` comments
3. API/action reads comments filtered by `postId`
4. repository sorts by `createdAt` ascending and slices by page size `20`
5. UI renders initial comments on first paint
6. load-more requests `page>=2` and appends into existing list

## checks
- unauthenticated request for `page=1` returns comment list with `200`
- returned comments are sorted by `createdAt` ascending
- initial post detail render includes server-side injected comments
- each page returns at most `20` comments
- `page>=2` request appends new page after existing list

# commentupdate plan

## scope
- fix `commentupdate` action entry on `app/actions/commentupdate.ts` and keep schema/steps split
- keep `PATCH /api/comments/[commentId]` as the only update endpoint and preserve existing UI inline edit flow
- enforce requester-author ownership check before storage update
- update comment storage `updatedAt` and return updated comment payload for UI rerender
- keep changes minimal and avoid unrelated refactor

## input_rules
- `commentId`: required non-empty string and `/^[a-zA-Z0-9_-]{3,128}$/`
- `content`: required 1..500 chars and non-empty after trim
- requester login id: required, and must match comment `authorLoginId`
- target comment: must exist before update

## input_steps
1. click `수정` button in own comment row
2. switch to inline edit mode (`textarea`)
3. click `저장` after editing content
4. run client-side content validation
5. send `PATCH /api/comments/[commentId]`
6. validate requester==author and input on server action path
7. persist updated content and refresh `updatedAt`
8. return result and exit edit mode with updated UI state

## checks
- invalid input returns `invalid_input`
- non-author requester returns `forbidden`
- missing target returns `not_found`
- success updates `content` and `updatedAt`
- `rg "commentupdate" app` confirms trigger -> action -> logic -> state update path
- `pnpm test` and `pnpm lint` pass
