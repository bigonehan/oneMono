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
