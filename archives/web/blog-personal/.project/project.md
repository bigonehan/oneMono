# info
name : blog_personal_tistory
description : `blog-personal` 폴더에 개인이 글을 작성하고 읽을 수 있는 티스토리형 블로그를 구현한다.
spec : astro, react, typescript, playwright
path : /home/tree/oneMono/template/web/blog-personal

# features
- personal_blog_shell
- personal_blog_write_flow
- personal_blog_validation

# rules
- 기존 `blog` 템플릿 구조와 글 저장 방식(`posts/`)을 유지한다.
- 개인 블로그 느낌의 메인 화면, 글 상세, 글쓰기 흐름을 우선한다.
- 변경 범위는 `blog-personal` 폴더 내부로 제한한다.
- 구현 후 ORC check, 타입체크, 빌드, Playwright, dev 서버 검증을 수행한다.

# constraints
- 불필요한 리팩터링, 포맷팅 전면 수정, 무관한 파일 변경을 금지한다.
- 글 작성 시 실제로 `posts/`에 파일이 저장되는 흐름을 깨지 않는다.
- 메인 화면은 티스토리형 개인 블로그 느낌의 헤더, 소개, 대표 글, 최근 글, 카테고리 탐색을 포함해야 한다.
- 검증 없는 UI 변경 완료 처리를 금지한다.

# domains
## personal_shell
### states
- shell_created
- tistory_style_applied
- personal_sections_connected
### action
- 개인 블로그 메인 화면과 공통 레이아웃을 구성한다.
- 대표 글, 최근 글, 카테고리 탐색 섹션을 연결한다.
- 반응형 스타일을 적용한다.
### rules
- 콘텐츠 탐색과 글쓰기 진입이 첫 화면에서 바로 보여야 한다.
- 데이터 소스는 기존 posts 읽기 로직을 재사용한다.
### constraints
- 다른 템플릿 폴더를 수정하지 않는다.

## write_flow
### states
- write_entry_ready
- form_submit_connected
- article_saved
### action
- 글쓰기 화면을 개인 블로그 문맥에 맞게 구성한다.
- 입력 -> API -> 파일 저장 흐름을 유지한다.
- 생성된 글이 상세/목록에서 다시 노출되도록 보장한다.
### rules
- 기존 `WriteArticleForm`과 `/api/articles/create` 경로를 유지한다.
- 검증은 실제 파일 생성 여부까지 확인한다.
### constraints
- 더미 성공 처리나 고정 반환을 추가하지 않는다.

## validation
### states
- orc_job_created
- drafts_generated
- ui_checked
- tests_passed
### action
- ORC job/draft/check 체인을 실행한다.
- Playwright와 타입체크, 빌드, dev 서버를 검증한다.
- 필요한 캡처와 로그를 남긴다.
### rules
- 실패 시 같은 단계부터 재시도한다.
- UI 작업이므로 실제 실행 기반 검증을 포함한다.
### constraints
- 검증 중 실패가 남아 있으면 완료 처리하지 않는다.
