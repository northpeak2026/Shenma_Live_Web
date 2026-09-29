# Shenma Live Web — Unified Local Preview

## Canonical project

- Canonical Project Root: `/Users/apple/Documents/ChatGPT/Shenma_Live_Web`
- Git Repository Root: `/Users/apple/Documents/ChatGPT/Shenma_Live_Web`
- Canonical Preview URL: <http://127.0.0.1:4173/>
- Manual foreground command: `pnpm dev`
- Codex persistent-server command: `pnpm preview:ensure`
- Persistent session: `screen` session `shenma_live_web_4173`
- Dev server: Vite, bound to `127.0.0.1`, port `4173`, `strictPort: true`

This repository is one complete Web application. Home, Live, Preview, Matches, Chat, Search, live-room details, team details, host profiles, and all future modules share this project and this one server.

## Required workflow

1. Before editing, confirm `git rev-parse --show-toplevel` resolves to the canonical project root above.
2. Check port 4173 before starting a server: `lsof -nP -iTCP:4173 -sTCP:LISTEN`.
3. If the running process belongs to this canonical project, reuse it. Do not start another server.
4. If nothing is listening, Codex must run `pnpm preview:ensure` from the canonical project root. This starts the detached `screen` session and survives individual task completion.
5. If an unrelated process occupies 4173, investigate and report the conflict. Do not switch to 4174, 4175, 3000, 3001, or another port.
6. Never create a module-specific project copy, temporary project, or alternate Worktree for routine page work.
7. After changes, run the relevant verification, confirm the canonical server is reachable, and always output <http://127.0.0.1:4173/>.

## Current router links

- Home: <http://127.0.0.1:4173/#/>
- Live: <http://127.0.0.1:4173/#/live>
- Preview: <http://127.0.0.1:4173/#/schedule>
- Matches: <http://127.0.0.1:4173/#/matches>
- Chat: <http://127.0.0.1:4173/#/chat>
- Search example: <http://127.0.0.1:4173/#/search?keyword=NBA>

The project currently uses hash routing, so page links must remain under the same `127.0.0.1:4173` origin.

## Completion checklist

- Code changes exist in the canonical root.
- No compilation or obvious browser errors remain.
- Only the canonical server uses port 4173.
- The main preview URL is reachable.
- The final response includes the canonical preview URL and, when helpful, a route-specific URL on the same origin.
