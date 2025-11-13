#!/usr/bin/env bash
# Helper to launch the tmux MCP server and then run `codex "one:coding"`.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
LOG_FILE="${MCP_ROOT}/.onePM.log"
SERVER_CMD=("bun" "run" "src/tmux-mcp-server.ts")

if [[ -z "${TMUX:-}" ]]; then
  echo "⚠️  This workflow expects to run inside tmux." >&2
fi

start_mcp_server() {
  (
    cd "${MCP_ROOT}"
    "${SERVER_CMD[@]}" >>"${LOG_FILE}" 2>&1 &
    echo $! >"${MCP_ROOT}/.onePM-mcp-server.pid"
  )
}

stop_mcp_server() {
  local pid_file="${MCP_ROOT}/.onePM-mcp-server.pid"
  if [[ -f "${pid_file}" ]]; then
    local pid
    pid="$(cat "${pid_file}")"
    if [[ -n "${pid}" ]] && ps -p "${pid}" >/dev/null 2>&1; then
      kill "${pid}" >/dev/null 2>&1 || true
    fi
    rm -f "${pid_file}"
  fi
}

cleanup() {
  stop_mcp_server
}

trap cleanup EXIT

start_mcp_server

COMMAND="${1:-one:coding}"
shift || true

codex "${COMMAND}" "$@"
