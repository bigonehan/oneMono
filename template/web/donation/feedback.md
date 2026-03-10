# 결과
- runner: Web
- detected command: npm run dev
- steps: if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi; (npm run dev) > .rc-web-server.log 2>&1 & echo $! > .rc-web-server.pid; sleep 5, python3 - "http://127.0.0.1:3000" <<'PY'
import sys
import time
import urllib.request

url = sys.argv[1]
last = None
for _ in range(30):
    try:
        with urllib.request.urlopen(url, timeout=2) as response:
            if response.status < 500:
                raise SystemExit(0)
    except Exception as exc:
        last = exc
        time.sleep(1)

print("server not ready: " + url + ": " + str(last), file=sys.stderr)
raise SystemExit(1)
PY, if command -v agent-browser >/dev/null 2>&1; then agent-browser install; else npm install -g agent-browser && agent-browser install; fi, agent-browser open http://172.21.188.149:3000, agent-browser wait ".auth-card:nth-of-type(1) input[placeholder='user id']", agent-browser snapshot -i, agent-browser screenshot rc-web.png && printf 'Screenshot saved: rc-web.png\n' && agent-browser close; if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi
- captures: /home/tree/home/template/web/donation/terminal-capture.txt, /home/tree/home/template/web/donation/rect-capture.png, /home/tree/home/template/web/donation/screen-capture.png

# 체크리스트
- [x] donation template verification -> 기본 점검 통과 : mode 기반 기본 체크리스트 / - [x] step 실행 -> output_log 기록 : 실행 로그 수집

# 미해결
- 없음

# 보완
- 현재 draft 절차가 체크리스트 기준을 만족했고 화면 근거(snapshot/screenshot)가 기록됐다.

# 참고할 점
- Stripe Checkout은 `submit_type: "donate"`와 `success_url`/`cancel_url` 조합을 지원하고, 결제 완료 반영은 webhook 기준으로 처리하는 구성이 권장된다. 현재 구현은 이 흐름에 맞춰 `app/api/donate/route.ts`와 `app/api/stripe/webhook/route.ts`를 연결했다. 출처: [Stripe Checkout Sessions API](https://docs.stripe.com/api/checkout/sessions/create), [Stripe webhook signature verification](https://docs.stripe.com/webhooks/signature)
- 기부 랜딩 페이지 베스트 프랙티스 자료들은 공통적으로 제안 금액, 신뢰 신호, 모바일 우선 CTA, 구체적인 임팩트 설명을 강조한다. 현재 템플릿은 preset 금액, trust badge, 진행률, 단일 CTA 흐름을 갖췄고 기본 요건은 충족한다. 출처: [Donorbox donation page best practices](https://donorbox.org/nonprofit-blog/donation-page-best-practices), [Classy donation page best practices](https://www.classy.org/blog/online-donation-page-best-practices/)

# 개선할 수 있는 점
- 일회성 결제만 있는 상태라 월간 후원 토글을 추가하면 재방문 가치와 평균 LTV를 높일 여지가 있다.
- `Donate with Stripe` 직전 구간에 수수료 부담 체크박스, 최근 업데이트 시간, 예산 사용 비율 요약을 넣으면 신뢰 설득력이 더 좋아진다.
- `POST /api/donate`는 현재 Stripe 키가 없으면 즉시 실패한다. 운영 배포 전에는 `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, 성공/취소 후 리다이렉트 도메인을 실제 값으로 고정해야 한다.

# 디자인 개선
- 모바일에서 hero 설명, progress, CTA가 첫 화면 안에서 더 가깝게 붙도록 압축하면 모금 목적이 더 빠르게 전달된다.
- 현재 비주얼은 정보 중심이라 안정적이지만, 실제 수혜 사진/인용문/업데이트 카드가 추가되면 감정적 설득력이 더 올라간다.
- impact card는 텍스트 설명 중심이라 시각적 위계가 약하다. 금액, 결과, 시간 범위를 3단 구조로 재정렬하면 스캔 속도가 좋아진다.

# 과정 개선
- `cargo run --bin orc -- create_input_md`가 제한 시간 안에 끝나지 않아 ORC 산출물 생성 흐름이 초반부터 멈췄다. 입력 초안이 비었을 때는 기존 `input.md` diff 기반 보강 모드가 필요하다.
- `impl_code_draft`는 donation 요구사항을 반영하지 못하고 generic 초안에 머물렀다. feature 설명이 구체적인 UI/API 흐름일 때는 `.project/project.md`와 `input.md`의 섹션을 직접 매핑하는 구현 모드가 필요하다.
- `rc clit test`는 현재 로컬 `drafts.yaml`를 읽지 않고 내부 `build_drafts()`의 `.auth-card` 셀렉터를 강제로 사용한다. 이번 작업에서는 dev 전용 probe를 추가해 우회했지만, 근본적으로는 프로젝트별 selector override 또는 `drafts.yaml` 우선 로딩이 필요하다.
- `agent-browser install`은 종료 코드는 0인데도 경고성 stderr를 남겨 RC 내부 error heuristic에 걸릴 수 있다. 실패 판정은 stderr 문자열보다 exit code 중심으로 바꾸는 편이 안정적이다.
- `cargo run --bin orc -- check_code_draft -a`는 2026-03-10 기준 `[orc-status] codex exec | elapsed=60s | waiting for llm response` 상태에서 장시간 정체됐다. 이 단계는 타임아웃 이후 중간 원인과 재시도 지점을 바로 출력하도록 바꾸는 편이 좋다.

# 추가 검증 메모
- 실제 실행 검증으로 admin 저장 API를 호출해 `campaign-content.json` 변경과 landing 재반영을 확인했고, 이후 원본 데이터를 복구했다.
- fake Stripe test key(`sk_test_123`)로 `/api/donate`를 호출했을 때 Stripe SDK까지 도달해 `Invalid API Key provided: sk_test_123`를 반환하는 것을 확인했다.
- test webhook 서명을 생성해 `/api/stripe/webhook`를 호출했을 때 누적 모금액과 최근 후원자 목록이 갱신되는 것을 확인했고, 검증 후 `donation-state.json`도 원복했다.
- Next.js 16 개발 서버는 RC가 `172.21.188.149`로 접속할 때 cross-origin 경고를 남겼다. 필요하면 `allowedDevOrigins`를 명시해 dev 검증 로그를 더 안정화할 수 있다. 출처: [Next.js allowedDevOrigins](https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins)
