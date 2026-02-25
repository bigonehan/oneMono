## 2026-02-20 - funcion.yaml 패키지 기능 목록 생성
- 모노레포 `packages` 하위 패키지를 순회해 공개 기능을 기준으로 `funcion.yaml`을 생성했다.
- `domains` 아래는 패키지 이름별 기능 리스트 형태로 정리했다.

## 2026-02-20 - 약어 규칙 추가 및 funcion.yaml 압축
- `AGENTS.md`에 `crud/c/r/u/d` 약어 의미와 사용 규칙을 추가했다.
- `funcion.yaml`을 약어 사전과 객체별 `can` 액션 중심 구조로 압축해 LLM이 객체-행동 매핑을 빠르게 파악하도록 정리했다.

## 2026-02-20 - user/article 도메인 및 auth/editor 기능 추가
- `packages/domains`의 기존 시험용 도메인(task/user)을 정리하고 `@domain/user`, `@domain/article`를 새로 구성했다.
- `packages/ports`에 `user_port`, `article_port` CRUD 인터페이스를 추가하고 기존 task port를 제거했다.
- `packages/infras/gel-client`에 user/article 스키마와 EdgeDB schema 문자열(`edgeDbSchema`)을 추가했다.
- `packages/features/auth`(better-auth 기반 id/pw 인증 흐름)와 `packages/features/editor`(tiptap 에디터 컴포넌트)를 추가했다.
- `packages/ui/shadcn`에 `form_login`, `form_editor`, `list_article` 컴포넌트를 추가하고 export를 갱신했다.
- `funcion.yaml`을 현재 구조에 맞춰 domains/features/ports/adapters/infras/ui 항목으로 업데이트했다.

## 2026-02-20 - ports 레이어 제거 및 도메인 내부 포트 소유 일원화
- `packages/ports/*` 사용을 중단하고 포트 인터페이스를 각 도메인 패키지(`packages/domains/<domain>/src/<domain>_port.ts`)에서 관리하도록 규칙을 정리했다.
- `AGENTS.md`, `AGENTS.override.md`, `packages/domains/AGENTS.md`에 포트 위치/소유 규칙을 명시했다.
- `funcion.yaml`에서 분리된 `ports` 섹션을 제거해 도메인 중심 구조와 일치시켰다.

## 2026-02-20 - @ui/motion 패키지 추가 및 Next 템플릿 스크롤 텍스트 애니메이션 적용
- `packages/ui/motion` 패키지를 추가하고 `gsap`, `lenis` 의존성을 구성했다.
- `packages/ui/motion/src/animation/slide-up-text.tsx`에 스크롤 진입 시 텍스트가 위로 떠오르는 GSAP 컴포넌트를 구현했다.
- `template/web/next/app/page.tsx`에서 `@ui/motion`의 `Lenis`, `SlideUpText`를 사용하도록 변경했다.
- `template/web/next/package.json`에 `@ui/motion` 워크스페이스 의존성을 추가했다.

## 2026-02-20 - React Native(Expo) 템플릿 추가 및 FlashList 기본 구성
- `template/mobile/expo` 템플릿을 새로 추가하고 Expo 실행 스크립트(`dev/android/ios/web`)를 구성했다.
- `template/mobile/expo/App.tsx`에서 `@shopify/flash-list`를 사용하는 기본 리스트 화면을 구현했다.
- 모노레포 기능 기록 파일 `funcion.yaml`에 `template-mobile-expo` 기능 항목(`mobile_expo_flashlist_r`)을 반영했다.

## 2026-02-20 - Next 템플릿 헤더 로그인 메뉴 및 auth 폼 연동
- `packages/features/auth`에 `components/form_login.tsx`, `components/form_sign_up.tsx`를 추가하고 `src/index.ts`에서 export 하도록 구성했다.
- `template/web/next/app/page.tsx`에서 `@features/auth`의 로그인/회원가입 폼을 불러와 `auth-section`에서 두 폼을 모두 테스트할 수 있게 연결했다.
- `packages/ui/shadcn/components/layout/header.tsx`에 Login 메뉴를 추가해 `template/web/next` 헤더에서 인증 섹션으로 이동 가능하게 했다.
- 워크스페이스 인식 문제를 해결하기 위해 루트 `package.json`에 `packages/features/*`를 추가하고 의존성 링크를 갱신했다.

## 2026-02-20 - Next 템플릿 JWT 인증 메뉴(Login/Signin/Logout) 및 회원정보 표시 구현
- `template/web/next/app/api/auth/*` 라우트(`sign-up`, `login`, `logout`, `me`)를 추가해 JWT(HttpOnly cookie) 기반 인증 플로우를 구현했다.
- `template/web/next/lib/auth-jwt.ts`, `template/web/next/lib/auth-store.ts`를 추가해 토큰 서명/검증과 인메모리 사용자 저장소를 구성했다.
- `packages/ui/shadcn/components/layout/header.tsx`를 인증 상태 기반 메뉴로 확장해 비로그인 시 `Login/Signin`, 로그인 시 `Logout + 회원정보`를 노출하도록 변경했다.
- `template/web/next/app/page.tsx`를 API 연동으로 수정해 로그인/회원가입/로그아웃 동작과 현재 사용자 표시를 연결했다.
- `funcion.yaml`에 `template-web-next`의 JWT 인증 기능 항목을 반영했다.

## 2026-02-21 - Expo 모바일 기울기 실시간 화면 및 하단 탭 추가
- `template/mobile/expo/App.tsx`를 `List`/`Interaction` 하단 탭 구조로 변경했다.
- `Interaction` 화면에서 `expo-sensors` `Accelerometer`를 구독해 `x/y/z` 기울기 값을 실시간으로 표시하도록 구현했다.
- `template/mobile/expo/package.json`에 `expo-sensors` 의존성을 추가하고 타입체크(`bun run check-types`)를 통과했다.

## 2026-02-20 - Next 템플릿 Post 라우트/에디터 및 Markdown 저장 CRUD 연동
- `packages/domains/article/src/article_port.ts`의 CRUD 포트(create/get/list/update/delete) 제공 여부를 확인하고, 이를 구현하는 `@adapters/article-md`를 새로 추가했다.
- `@infras/article-md`를 추가해 Article 도메인 상태 필드와 일치하는 스키마 기반으로 `.md` 파일 저장/조회/수정/삭제 스토어를 구현했다.
- `template/web/next`에 `/post`, `/post/editor`, `/api/post`, `/api/post/[postId]`를 추가해 로그인 사용자 기준 글 등록/수정/삭제와 목록/상세 조회를 연결했다.
- `/post`의 글쓰기 버튼 클릭 시 `대기중...` 오버레이를 표시하고, 제목 클릭 시 본문 토글이 되도록 UI를 구현했다.
- 헤더/모바일 메뉴에 `Post` 항목을 추가하고 `bun run check-types`, `bun run lint`, 어댑터 실행 스크립트로 Markdown 저장/로드를 검증했다.

## 2026-02-20 - shadcn list_card 컴포넌트 추가 및 Next Post 메뉴 카드 목록 연동
- `packages/ui/shadcn/components/list` 폴더 존재 여부를 확인했고, 기존 폴더를 재사용해 `list_card.tsx`를 추가했다.
- `ListCard`에서 포스트 제목/이미지 썸네일/글쓴이를 카드 형태로 표시하도록 구현하고 `@ui/shadcn` export를 갱신했다.
- `template/web/next/app/post/page.tsx` 목록 렌더링을 `ListCard` 기반으로 교체해 `Post` 메뉴(`/post`) 진입 시 카드 UI가 보이도록 연결했다.
- `template/web/next/app/globals.css`에 list-card 스타일을 추가해 데스크톱/모바일에서 카드 레이아웃이 동작하도록 보강했다.
- 검증으로 `bunx turbo run check-types --filter=@ui/shadcn --filter=template-web-next` 및 `bunx turbo run lint --filter=template-web-next --filter=@ui/shadcn`를 통과했다.

## 2026-02-21 - 모노레포 패키지별 feature.yaml 일괄 생성
- 워크스페이스의 `package.json` 기준 패키지(루트/apps/packages/template, `.next`/`node_modules` 제외)를 순회해 `feature.yaml` 존재 여부를 점검했다.
- 누락된 모든 패키지에 LLM 인식용 `feature.yaml`을 생성하고 패키지 경로, 도메인, 요약, 핵심 기능 목록을 간략히 작성했다.
- 검증으로 패키지 20개 대비 `feature.yaml` 누락 0건을 확인했고 `bun run check-types`를 통과했다.

## 2026-02-20 - features dashboard 패키지 추가 및 user 정보 기본 대시보드 구현
- `packages/features/dashboard` 패키지를 신규 생성하고 기존 feature 패키지 규칙(`package.json`, `tsconfig.json`, `src/index.ts`)을 맞췄다.
- `@domain/user`의 `User` 타입을 사용하는 `DashboardUserPanel` 컴포넌트를 추가했다.
- 대시보드에서 사용자 수, 이름, ID, 생성일, 수정일을 표시하고 `pw`는 마스킹 처리해 노출을 제한했다.

## 2026-02-20 - shadcn 대시보드 UI 추가 및 Next Dash 메뉴/페이지 연결
- `packages/ui/shadcn/components/dashboard/dash_user_overview.tsx`를 추가해 대시보드 사용자 요약 UI를 새로 만들었다.
- `packages/ui/shadcn/src/index.ts`에 `DashUserOverview` export를 추가했다.
- `packages/ui/shadcn/components/layout/header.tsx`에 `Dash` 메뉴 링크를 추가했다.
- `template/web/next/app/page.tsx` 모바일 메뉴에 `Dash` 링크를 추가했다.
- `template/web/next/app/dash/page.tsx`를 추가해 `/api/auth/me` 기반 사용자 정보를 대시보드 UI로 렌더링하도록 연결했다.
- `template/web/next/app/globals.css`에 dash 페이지/카드 스타일을 추가했다.

## 2026-02-21 - shadcn gen_Pane 컴포넌트 및 도메인->Pane 매핑 함수 추가
- `packages/ui/shadcn/custom/gen_Pane.tsx`를 추가해 도메인 객체에서 `title`/`description`을 선택하는 `buildPaneFromDomain` 함수를 구현했다.
- `title`은 `title/name/id` 우선순위와 fallback 규칙으로 선택하고, `description`은 설명 계열 키 또는 멀티라인 속성 합성으로 구성되도록 했다.
- `GenPane` 컴포넌트와 `gen_Pane` alias를 추가하고 `@ui/shadcn` index export 및 tsconfig include(`custom`)를 갱신했다.

## 2026-02-24 - Expo 모바일 Grid 탭 핀치 줌/카메라 전환 추가
- `template/mobile/expo/App.tsx`에 하단 탭 `Grid`를 추가하고, 선택 시 핀치 입력으로 `3x3 -> 5x5 -> 7x7 -> 9x9` 그리드 전환이 동작하도록 구현했다.
- 핀치 이동량을 `zoom` 상태로 변환하고 `Animated.spring` 기반 카메라 스케일/위치 보간을 적용해 자연스럽게 멀어지는 전환감을 구성했다.
- UI 연결 검증으로 `Grid 탭 버튼 -> activeTab 상태 변경 -> onResponder 핀치 핸들러 호출 -> gridSize/zoom 상태 갱신 -> 그리드 재렌더` 경로를 `rg`와 빌드/타입체크로 확인했다.
