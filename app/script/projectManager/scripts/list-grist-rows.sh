#!/usr/bin/env bash
# Print rows from a specific Grist table (pass number or id, e.g., 13 or Table13).
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $(basename "$0") <table-id|number> [--limit N]" >&2
  exit 1
fi

TARGET_TABLE="$1"
shift

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${MCP_ROOT}"

bun run src/grist.ts rows "${TARGET_TABLE}" "$@"
