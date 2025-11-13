#!/usr/bin/env bash
# Flexible launcher for the tmux MCP server + Codex one:* workflows.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
LOG_FILE="${MCP_ROOT}/.onePM.log"
SERVER_CMD=("bun" "run" "main.ts")
WORKSPACE_DIR="$(pwd -P)"
export ONEPM_WORKSPACE="${WORKSPACE_DIR}"
export ONEPM_PLAN_PATH="${ONEPM_PLAN_PATH:-${WORKSPACE_DIR}/plan.md}"

RAW_FLOW="${1:-one:coding}"
if [[ "${RAW_FLOW}" == one:* ]]; then
  COMMAND="${RAW_FLOW}"
  FLOW_NAME="${RAW_FLOW#one:}"
else
  COMMAND="one:${FLOW_NAME}"
  FLOW_NAME="${RAW_FLOW}"
fi
shift || true
export ONEPM_FLOW="${FLOW_NAME}"

RULES_DIR="${MCP_ROOT}/rules"
RULE_FILE="${RULES_DIR}/${FLOW_NAME}.md"
export ONEPM_RULES_DIR="${RULES_DIR}"
if [[ -f "${RULE_FILE}" ]]; then
  export ONEPM_RULES_FILE="${RULE_FILE}"
else
  unset ONEPM_RULES_FILE 2>/dev/null || true
fi

if [[ -z "${TMUX:-}" ]]; then
  echo "⚠️  This workflow expects to run inside tmux." >&2
fi

MANAGER_PANE_FILE="${MCP_ROOT}/.tmux-manager-pane"
MANAGER_SOCKET_FILE="${MCP_ROOT}/.tmux-manager-socket"
if [[ -n "${TMUX:-}" ]]; then
  CURRENT_PANE="$(tmux display-message -p "#{pane_id}")"
  printf "%s" "${CURRENT_PANE}" >"${MANAGER_PANE_FILE}"
  CURRENT_SOCKET="$(tmux display-message -p "#{socket_path}")"
  printf "%s" "${CURRENT_SOCKET}" >"${MANAGER_SOCKET_FILE}"
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

codex "${COMMAND}" "$@"
