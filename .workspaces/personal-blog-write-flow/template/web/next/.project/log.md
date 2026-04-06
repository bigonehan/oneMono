## web_login_check
- command: if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi; (pnpm dev) > .rc-web-server.log 2>&1 & echo $! > .rc-web-server.pid; sleep 5
- messages: 
- errors: 
## web_login_check
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
## web_login_check
- command: if command -v agent-browser >/dev/null 2>&1; then agent-browser install; else npm install -g agent-browser && agent-browser install; fi
- messages: ⚠ Linux detected. If browser fails to launch, run:
  agent-browser install --with-deps
  or: npx playwright install-deps chromium

Installing Chromium browser...
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
✓ Chromium installed successfully

Note: If you see "shared library" errors when running, use:
  agent-browser install --with-deps

- errors: command=`if command -v agent-browser >/dev/null 2>&1; then agent-browser install; else npm install -g agent-browser && agent-browser install; fi` exit=Some(0)
## web_login_check
- command: agent-browser open http://172.21.188.149:3000
- messages: ✓ Monorepo Next Template
  http://172.21.188.149:3000/

- errors: 
## web_login_check
- command: agent-browser wait ".auth-card:nth-of-type(1) input[placeholder='user id']"
- messages: ✗ page.waitForSelector: Timeout 25000ms exceeded.
Call log:
[2m  - waiting for locator('.auth-card:nth-of-type(1) input[placeholder=\'user id\']') to be visible[22m


- errors: command=`agent-browser wait ".auth-card:nth-of-type(1) input[placeholder='user id']"` exit=Some(1) | ✗ page.waitForSelector: Timeout 25000ms exceeded.
Call log:
[2m  - waiting for locator('.auth-card:nth-of-type(1) input[placeholder=\'user id\']') to be visible[22m


## web_login_check
- command: agent-browser snapshot -i
- messages: - link "Main Profile QA" [ref=e1]
- link "Main" [ref=e2]
- link "Profile" [ref=e3]
- link "QA" [ref=e4]
- button "Open login" [ref=e5]
- button "Previous item" [ref=e6]
- button "Next item" [ref=e7]
- link "X" [ref=e8]
- link "IG" [ref=e9]
- link "GH" [ref=e10]

- errors: 
## web_login_check
- command: agent-browser screenshot rc-web.png && printf 'Screenshot saved: rc-web.png\n' && agent-browser close; if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi
- messages: ✓ Screenshot saved to rc-web.png
Screenshot saved: rc-web.png
✓ Browser closed

- errors: 
