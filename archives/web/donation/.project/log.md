## web_login_check
- command: if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi; (npm run dev) > .rc-web-server.log 2>&1 & echo $! > .rc-web-server.pid; sleep 5
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
- messages: ✗ page.goto: net::ERR_CONNECTION_REFUSED at http://172.21.188.149:3000/
Call log:
[2m  - navigating to "http://172.21.188.149:3000/", waiting until "load"[22m


- errors: command=`agent-browser open http://172.21.188.149:3000` exit=Some(1) | ✗ page.goto: net::ERR_CONNECTION_REFUSED at http://172.21.188.149:3000/
Call log:
[2m  - navigating to "http://172.21.188.149:3000/", waiting until "load"[22m


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
- messages: (no interactive elements)

- errors: 
## web_login_check
- command: agent-browser screenshot rc-web.png && printf 'Screenshot saved: rc-web.png\n' && agent-browser close; if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi
- messages: ✓ Screenshot saved to rc-web.png
Screenshot saved: rc-web.png
✓ Browser closed

- errors: 
## web_login_check
- command: if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi; (npm run dev) > .rc-web-server.log 2>&1 & echo $! > .rc-web-server.pid; sleep 5
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
- messages: ✓ Donation Template
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
- messages: - link "Manage campaign" [ref=e1]
- button "Previous item" [ref=e2]
- button "Next item" [ref=e3]
- button "$25 One family meal kit" [ref=e4]
- button "$100 Weekend delivery route" [ref=e5]
- button "$250 Pantry restock" [ref=e6]
- spinbutton "Custom amount (USD)" [ref=e7]
- textbox "Donor name" [ref=e8]
- button "Donate with Stripe" [ref=e9]
- link "X" [ref=e10]
- link "IG" [ref=e11]
- link "GH" [ref=e12]

- errors: 
## web_login_check
- command: agent-browser screenshot rc-web.png && printf 'Screenshot saved: rc-web.png\n' && agent-browser close; if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi
- messages: ✓ Screenshot saved to rc-web.png
Screenshot saved: rc-web.png
✓ Browser closed

- errors: 
## web_login_check
- command: if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi; (npm run dev) > .rc-web-server.log 2>&1 & echo $! > .rc-web-server.pid; sleep 5
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
- messages: ✓ Donation Template
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
- messages: - link "Manage campaign" [ref=e1]
- button "Previous item" [ref=e2]
- button "Next item" [ref=e3]
- button "$25 One family meal kit" [ref=e4]
- button "$100 Weekend delivery route" [ref=e5]
- button "$250 Pantry restock" [ref=e6]
- spinbutton "Custom amount (USD)" [ref=e7]
- textbox "Donor name" [ref=e8]
- button "Donate with Stripe" [ref=e9]
- link "X" [ref=e10]
- link "IG" [ref=e11]
- link "GH" [ref=e12]

- errors: 
## web_login_check
- command: agent-browser screenshot rc-web.png && printf 'Screenshot saved: rc-web.png\n' && agent-browser close; if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi
- messages: ✓ Screenshot saved to rc-web.png
Screenshot saved: rc-web.png
✓ Browser closed

- errors: 
## web_login_check
- command: if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi; (npm run dev) > .rc-web-server.log 2>&1 & echo $! > .rc-web-server.pid; sleep 5
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
- messages: ✓ Donation Template
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
- messages: - link "Manage campaign" [ref=e1]
- button "Previous item" [ref=e2]
- button "Next item" [ref=e3]
- button "$25 One family meal kit" [ref=e4]
- button "$100 Weekend delivery route" [ref=e5]
- button "$250 Pantry restock" [ref=e6]
- spinbutton "Custom amount (USD)" [ref=e7]
- textbox "Donor name" [ref=e8]
- button "Donate with Stripe" [ref=e9]
- link "X" [ref=e10]
- link "IG" [ref=e11]
- link "GH" [ref=e12]

- errors: 
## web_login_check
- command: agent-browser screenshot rc-web.png && printf 'Screenshot saved: rc-web.png\n' && agent-browser close; if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi
- messages: ✓ Screenshot saved to rc-web.png
Screenshot saved: rc-web.png
✓ Browser closed

- errors: 
## web_login_check
- command: if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi; (npm run dev) > .rc-web-server.log 2>&1 & echo $! > .rc-web-server.pid; sleep 5
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
- messages: ✓ Donation Template
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
- messages: - link "Manage campaign" [ref=e1]
- button "Previous item" [ref=e2]
- button "Next item" [ref=e3]
- button "$25 One family meal kit" [ref=e4]
- button "$100 Weekend delivery route" [ref=e5]
- button "$250 Pantry restock" [ref=e6]
- spinbutton "Custom amount (USD)" [ref=e7]
- textbox "Donor name" [ref=e8]
- button "Donate with Stripe" [ref=e9]
- textbox "user id" [ref=e10]
- link "X" [ref=e11]
- link "IG" [ref=e12]
- link "GH" [ref=e13]

- errors: 
## web_login_check
- command: agent-browser screenshot rc-web.png && printf 'Screenshot saved: rc-web.png\n' && agent-browser close; if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi
- messages: ✓ Screenshot saved to rc-web.png
Screenshot saved: rc-web.png
✓ Browser closed

- errors: 
## web_login_check
- command: if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi; (npm run dev) > .rc-web-server.log 2>&1 & echo $! > .rc-web-server.pid; sleep 5
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
- messages: ✓ Donation Template
  http://172.21.188.149:3000/

- errors: 
## web_login_check
- command: agent-browser wait ".auth-card:nth-of-type(1) input[placeholder='user id']"
- messages: ✓ Done

- errors: 
## web_login_check
- command: agent-browser snapshot -i
- messages: - link "Manage campaign" [ref=e1]
- button "Previous item" [ref=e2]
- button "Next item" [ref=e3]
- button "$25 One family meal kit" [ref=e4]
- button "$100 Weekend delivery route" [ref=e5]
- button "$250 Pantry restock" [ref=e6]
- spinbutton "Custom amount (USD)" [ref=e7]
- textbox "Donor name" [ref=e8]
- button "Donate with Stripe" [ref=e9]
- textbox "user id" [ref=e10]
- link "X" [ref=e11]
- link "IG" [ref=e12]
- link "GH" [ref=e13]

- errors: 
## web_login_check
- command: agent-browser screenshot rc-web.png && printf 'Screenshot saved: rc-web.png\n' && agent-browser close; if [ -f .rc-web-server.pid ]; then kill $(cat .rc-web-server.pid) >/dev/null 2>&1 || true; fi
- messages: ✓ Screenshot saved to rc-web.png
Screenshot saved: rc-web.png
✓ Browser closed

- errors: 
