# Domain Checklist (build_domain)

## 스킬 적용
- 사용 스킬: `build_domain`
- 이유: 요청이 도메인 생성/설계에 해당하며, 최소 도메인 수렴 원칙이 필요함.

## 1단계 질문 답변
- Q1 주체: 데스크톱 앱 사용자
- Q2 핵심 행위: 아티클을 작성/저장/조회
- Q3 중심 객체: article
- Q4 상태: 생성됨/수정됨/삭제됨
- Q5 동작: create/read/update/delete

## 2단계 흐름 문장
- 상태변화: `article`이 저장되면 `created/updated` 상태로 변한다.
- 도메인간 상호작용: `article`은 `user`를 작성자로 참조한다.
- 가능한 동작: article 목록 조회, article 생성, article 수정, article 삭제

## 최소 도메인 집합
- `article` (상위 단일 도메인)
- `user` (기존 개념 재사용, 작성자 식별용)

## 분해 근거 점검
- `article`과 `user`는 기존 패키지 경계(`@domain/article`, `@domain/user`)가 이미 존재함.
- 저장소(sqlite), 세션, transport는 도메인으로 승격하지 않음.

## 도메인별 기능 체크리스트

### article
- [x] article 목록 조회 (`r`)
- [x] article 생성 (`c`)
- [x] article 수정 (`u`) - 기본 템플릿에서는 인터페이스만 준비
- [x] article 삭제 (`d`) - 기본 템플릿에서는 인터페이스만 준비
- [x] `@domain/article` 타입(`NewArticle`, `ArticleRule`) 사용

### user
- [x] 기본 사용자 시드 1건 보장
- [x] article 저장 시 `author_id` 연결
- [x] `@domain/user` 타입 기반 작성자 개념 유지
