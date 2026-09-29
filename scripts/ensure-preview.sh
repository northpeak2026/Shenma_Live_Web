#!/bin/sh
set -eu

SCREEN_NAME="shenma_live_web_4173"
PROJECT_ROOT="/Users/apple/Documents/ChatGPT/Shenma_Live_Web"
PREVIEW_URL="http://127.0.0.1:4173/"

if curl -fsS -o /dev/null --max-time 2 "$PREVIEW_URL"; then
  echo "Shenma Live Web preview is already running: $PREVIEW_URL"
  exit 0
fi

if lsof -nP -iTCP:4173 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port 4173 is occupied by another process. Refusing to use a fallback port." >&2
  exit 1
fi

if /usr/bin/screen -ls 2>/dev/null | grep -q "[.]${SCREEN_NAME}"; then
  echo "The preview screen session exists but port 4173 is not reachable. Inspect it before restarting." >&2
  exit 1
fi

/usr/bin/screen -dmS "$SCREEN_NAME" /bin/sh -c "cd \"$PROJECT_ROOT\" && exec sh scripts/vite-local.sh"

attempt=0
while [ "$attempt" -lt 20 ]; do
  if curl -fsS -o /dev/null --max-time 1 "$PREVIEW_URL"; then
    echo "Shenma Live Web preview started: $PREVIEW_URL"
    exit 0
  fi
  attempt=$((attempt + 1))
  sleep 0.25
done

echo "Preview server did not become ready on port 4173." >&2
exit 1
