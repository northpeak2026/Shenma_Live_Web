#!/bin/sh
set -eu

CODEX_NODE="/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

if command -v node >/dev/null 2>&1; then
  NODE_EXEC="$(command -v node)"
elif [ -x "$CODEX_NODE" ]; then
  NODE_EXEC="$CODEX_NODE"
else
  echo "Node.js was not found. Install Node.js or load the Codex workspace runtime." >&2
  exit 127
fi

exec "$NODE_EXEC" ./node_modules/vite/bin/vite.js "$@"
