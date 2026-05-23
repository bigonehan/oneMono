# AGENTS.md

## 패키지 범위
- `packages/ui/shadcn`은 shadcn 기반 컴포넌트 모음 패키지다.
- shadcn/Radix 기반 primitive와 이를 조합한 재사용 UI 컴포넌트를 이 패키지에서 관리한다.
- 앱별 라우트, 권한, 도메인 정책, 데이터 조회 로직은 이 패키지에 두지 않고 feature 또는 app 계층에서 관리한다.

## 버전 관리
- 기능 추가 또는 기능 개선이 있을 때 이 패키지의 `package.json` 버전을 `0.0.1`씩 올린다.
- 별도 지시가 없으면 patch 단위 증가를 사용한다.
