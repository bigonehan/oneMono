# 기능 계획: donation landing template

## 범위
- 경로는 `template/web/donation`이고 Next.js App Router 기반 단일 페이지 모금 랜딩을 제공한다.
- 메인 페이지는 소개(hero), 상세 섹션, 진행률 표시, 기부 금액 선택/입력, Stripe 결제 버튼을 포함한다.
- `admin` 화면에서 소개 문구, 상세 문구, CTA 문구, 색상 토큰, 목표 금액을 수정할 수 있어야 한다.
- 결제 완료는 Stripe webhook을 통해 누적 모금액 데이터에 반영한다.

## 입출력
- 입력: 방문자의 기부 금액 선택/입력, admin의 문구/스타일 수정, Stripe webhook payload
- 출력: Stripe Checkout redirect, 누적 모금 상태 갱신, 랜딩/관리 화면 실시간 반영

## 영향 범위
- `.../donation/app/*`
- `.../donation/components/*`
- `.../donation/lib/*`
- `.../donation/store/*`
- `.../donation/data/*`
- 필요 시 `.../packages/ui/shadcn/*`

## 검증
- `cd /home/tree/home/template/web/donation && npm run lint`
- `cd /home/tree/home/template/web/donation && npm run check-types`
- `cd /home/tree/home/template/web/donation && npm run build`
- `cd /home/tree/home/template/web/donation && cargo run --manifest-path /home/tree/project/rust-orc/Cargo.toml --bin rc -- clit test -p . -m "donation template verification"`
- `rg -n "donate|checkout|webhook|admin|editor|progress|store|save|update" /home/tree/home/template/web/donation`
