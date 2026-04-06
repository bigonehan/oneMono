# feedback

## 문제
- 초기 Playwright 캡처에서 `current.png` 대비 하단 카드 수가 부족했고 메타 칩/간격 스타일이 달랐다.
- Chromium headless 캡처는 폰트 대기 단계에서 timeout이 발생했다.
- 711px 뷰포트에서 모바일 브레이크포인트가 걸려 상단 2열이 1열로 붕괴됐다.

## 미해결점
- 기준 이미지와 픽셀 단위 완전 일치까지는 텍스트/이미지 압축 차이에 따른 미세 조정 여지가 있다.
- 캡처 브라우저를 firefox headless로 고정해 안정성을 확보했으며, Chromium 경로는 환경 이슈로 제외했다.

## 반영 내용
- 기준 스크린샷에서 카드 이미지를 crop해 로컬 asset(`public/reference/*.jpg`)으로 사용했다.
- `@ui/shadcn`의 `ListBlogShowcase` 컴포넌트로 상단 2열 + 하단 3카드 레이아웃을 고정했다.
- 반응형 기준을 `640px`로 조정해 711px 기준 화면에서 참조와 같은 배치가 유지되게 수정했다.
