# AGENTS.md

## Project
- Service name: 편한걸음
- Path: `apps/web/sapoon`
- Implementation scope: all app implementation lives under `apps/web/sapoon/src/`.
- Target: mobile-accessible public web app for the tourism data web app contest.

## Contest Summary
- Contest: 관광 데이터 활용 공모전 웹 앱 개발 부분
- Submission: PDF, 5 pages
- Deadline from source document: 5월 6일
- Required: 한국관광공사 OpenAPI(TourAPI) usage and web service development.
- Judging criteria: service planning, service completeness, data usage fit, service extensibility.

## Problem Summary
- Domain: tourism + seniors.
- Target user: 65+ senior travelers with limited digital confidence and walking constraints.
- Core lack: senior walking-condition information and a simple exploration UI.
- Need: independently find safe, low-fatigue travel destinations with clear walking burden signals.
- Problem: seniors give up planning or experience on-site fatigue because current apps are text-heavy, complex, and do not translate barrier-free data into senior-friendly walking judgment.
- Differentiation: create an intermediate judgment layer called `시니어 쾌적 보행 지수` instead of listing raw tourism or barrier-free data.

## TourAPI-First Design Decisions
- Required domains:
  - Tourist attraction
  - Walking profile
  - Accessibility and barrier-free information
  - Nearby convenience facilities
  - Recommendation result
  - Saved trip item
- Required menus:
  - 조건 입력
  - 추천 보기
  - 상세 보기
  - 나의 편한 여행
- Required feature flow:
  - User chooses region, walking time, slope/stair burden, and assistive device use.
  - Mock repository returns TourAPI-like attraction data with barrier-free, restroom, and rest-area attributes.
  - Effect Schema validates domain-shaped data.
  - Scoring logic calculates senior walking comfort score and grade.
  - Results are sorted by lowest walking burden and shown as large, high-contrast cards.
  - User opens detail information and saves a destination to `나의 편한 여행`.
- Future API adapter default:
  - Keep mock repository behind domain functions so TourAPI, barrier-free API, DEM/V-World, public restroom, and heat shelter adapters can replace mock data later.

## Step Goals and Progress
- [x] Compress source document into project decisions.
- [x] Decide initial domains, menus, and feature flow before TourAPI implementation.
- [x] Create Next.js app scaffold under `apps/web/sapoon`.
- [x] Build Effect Schema and mock tourism implementation.
- [x] Build mobile-first senior-friendly recommendation UI.
- [x] Verify typecheck and production build.
- [x] Merge work back to default jj workspace and clean temporary workspace.

## Versioning
- 기능 추가 또는 기능 개선이 있을 때 이 패키지의 `package.json` 버전을 `0.0.1`씩 올린다.
- 별도 지시가 없으면 patch 단위 증가를 사용한다.
- 버전 세그먼트는 기본적으로 두 자리(`00`~`99`)를 넘기지 않도록 관리한다.

## Local Rules
- Do not start a long-running dev server unless the user explicitly requests it.
- Prefer existing `packages/ui` components before creating app-local UI.
- Current reusable UI package decision: use `@ui/shadcn` `Button`; compose missing app-specific cards, badges, and panels inside this app.
