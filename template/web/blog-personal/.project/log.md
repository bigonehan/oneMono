## web_smoke_check
- command: if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi; nohup npm run dev > .rc-web-server.log 2>&1 < /dev/null & echo $! > .rc-web-server.pid; sleep 5
- messages: 
- errors: 
heartbeat: step~ procedure=web_smoke_check elapsed=15s command=python3 - "http://127.0.0.1:3000" <<'PY' import sys import time import urllib.request url = sys.argv[1] last = None for _ in range(30): try: with urllib.requ...
heartbeat: step~ procedure=web_smoke_check elapsed=30s command=python3 - "http://127.0.0.1:3000" <<'PY' import sys import time import urllib.request url = sys.argv[1] last = None for _ in range(30): try: with urllib.requ...
## web_smoke_check
- command: python3 - "http://127.0.0.1:3000" <<'PY'
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
PY
- messages: server not ready: http://127.0.0.1:3000: <urlopen error [Errno 111] Connection refused>

- errors: command=`python3 - "http://127.0.0.1:3000" <<'PY'
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
PY` exit=Some(1) | server not ready: http://127.0.0.1:3000: <urlopen error [Errno 111] Connection refused>

## web_smoke_check
- command: if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi; nohup npm run dev > .rc-web-server.log 2>&1 < /dev/null & echo $! > .rc-web-server.pid; sleep 5
- messages: 
- errors: 
## web_smoke_check
- command: python3 - "http://127.0.0.1:3000" <<'PY'
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
PY
- messages: 
- errors: 
## web_smoke_check
- command: if command -v agent-browser >/dev/null 2>&1; then agent-browser install; else npm install -g agent-browser && agent-browser install; fi
- messages: [33m⚠[0m Linux detected. If browser fails to launch, run:
  agent-browser install --with-deps

[36mInstalling Chrome...[0m
[32m✓[0m Chrome 147.0.7727.24 is already installed

- errors: 
## web_smoke_check
- command: agent-browser open http://127.0.0.1:3000
- messages: [32m✓[0m [1m개인 블로그[0m
  [2mhttp://127.0.0.1:3000/[0m

- errors: 
## web_smoke_check
- command: agent-browser wait "body"
- messages: [32m✓[0m Done

- errors: 
## web_smoke_check
- command: agent-browser snapshot -i
- messages: - link "blog-personal" [ref=e1]
- link "홈" [ref=e6]
- link "검색" [ref=e7]
- link "태그" [ref=e8]
- link "카테고리" [ref=e9]
- link "글쓰기" [ref=e10]
- heading "개인이 글을 쓰고 쌓아 두는 기본형 블로그" [level=1, ref=e11]
- link "새 글 작성" [ref=e12]
- link "대표 글 읽기" [ref=e13]
- heading "기록하는 개발자" [level=2, ref=e21]
- heading "Newsletter Launch Window" [level=2, ref=e14]
- link "#newsletter" [ref=e15]
- link "#launch" [ref=e16]
- link "#distribution" [ref=e17]
- link "본문 보러가기" [ref=e18]
- heading "최근 글" [level=2, ref=e19]
- link "전체 카테고리" [ref=e20]
- link "2026-03-06 · life Audience Trust Loop Why repeat readers convert better when sponsor fit is obvious." [ref=e22]
- link "2026-03-05 · tech Playwright Write Smoke 1772698414 playwright write flow verification description" [ref=e23]
- link "2026-03-02 · tech Content Search How search index works" [ref=e24]
- link "2026-03-01 · frontend Astro Blog Intro Astro blog starter post" [ref=e25]
- heading "빠른 이동" [level=3, ref=e26]
- link "글쓰기" [ref=e27]
- link "검색" [ref=e28]
- link "태그 모아보기" [ref=e29]
- heading "카테고리" [level=3, ref=e30]
- link "frontend 2" [ref=e31]
- link "life 1" [ref=e32]
- link "tech 2" [ref=e33]
- button "Menu" [ref=e2]
- button "Inspect" [ref=e3]
- button "Audit" [ref=e4]
- button "Settings" [ref=e5]

- errors: 
## web_smoke_check
- command: agent-browser screenshot "/home/tree/oneMono/template/web/blog-personal/.project/screenshot/rc-web.png" && test -f "/home/tree/oneMono/template/web/blog-personal/.project/screenshot/rc-web.png" && printf 'Screenshot saved: /home/tree/oneMono/template/web/blog-personal/.project/screenshot/rc-web.png\n' && agent-browser close; if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi
- messages: [32m✓[0m Screenshot saved to [32m/home/tree/oneMono/template/web/blog-personal/.project/screenshot/rc-web.png[0m
Screenshot saved: /home/tree/oneMono/template/web/blog-personal/.project/screenshot/rc-web.png
[32m✓[0m Browser closed

- errors: 
