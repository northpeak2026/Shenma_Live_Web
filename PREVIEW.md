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
- Data: <http://127.0.0.1:4173/data> (GitHub Pages uses `#/data`)
- Chat: <http://127.0.0.1:4173/#/chat>
- App download (local): <http://127.0.0.1:4173/download>
- App download (GitHub Pages): <https://northpeak2026.github.io/Shenma_Live_Web/#/download>
- Headlines: <http://127.0.0.1:4173/#/news>
- News detail: <http://127.0.0.1:4173/news/1001> (GitHub Pages uses `#/news/1001`)
- Search example: <http://127.0.0.1:4173/#/search?keyword=NBA>

The project currently uses hash routing, so page links must remain under the same `127.0.0.1:4173` origin.

- Personal center: <http://127.0.0.1:4173/#/profile/mock-user>
- Following: <http://127.0.0.1:4173/#/profile/mock-user?tab=following>
- Creator application: <http://127.0.0.1:4173/#/profile/mock-user?tab=creator>
- Creator workbench (Mock): <http://127.0.0.1:4173/#/creator>
- Creator schedules: <http://127.0.0.1:4173/#/creator?module=schedule>
- Creator analytics: <http://127.0.0.1:4173/#/creator?module=analytics>
- Creator history: <http://127.0.0.1:4173/#/creator?module=history>

The personal center provides three Mock identity scenarios: ordinary / not applied, ordinary / reviewing, and creator / approved. Selecting a scenario restores its initial test assets, tasks, and application state. Creator identity follows the approved application status. Application status, submission time, and modification count persist with the existing user. Submitted fields and compressed document photo previews are kept in sessionStorage to repopulate the review edit form. Each confirmed modification consumes one of three opportunities; cancelling or returning without submitting does not consume one. After three modifications, the edit entry is hidden. The demonstration verification code is 123456 with a 60-second resend countdown.

- Anchor home (live): <http://127.0.0.1:4173/#/anchor/achen>
- Anchor home (offline): <http://127.0.0.1:4173/#/anchor/xiaoyu>
- Anchor home (empty schedule/replays): <http://127.0.0.1:4173/#/anchor/qingning>

## Completion checklist

- Code changes exist in the canonical root.
- No compilation or obvious browser errors remain.
- Only the canonical server uses port 4173.
- The main preview URL is reachable.
- The final response includes the canonical preview URL and, when helpful, a route-specific URL on the same origin.

The creator workbench uses the existing VIP 5 Mock user. Its Mock live-state selector resets the sample live setup and plans for testing; normal starts, cancellations, and saved changes persist locally. Push credentials are demonstration values.

- Game center / treasure wheel: <http://127.0.0.1:4173/#/game>
- Task center: <http://127.0.0.1:4173/#/profile/mock-user?tab=tasks>

幸运大转盘支持转盘次数、钻石、金币三种消耗方式。默认单次消耗分别为 1 次、10 钻石、100 金币，配置与初始余额位于 `src/game-state.js`。余额与历史记录保存在原有 localStorage 中，旧记录自动兼容；免费次数奖励仍自动增加 3 次。钻石与金币为游戏模块的本地余额，不对接钱包或礼物背包。

- 邀请好友：<http://127.0.0.1:4173/#/profile/mock-user?tab=invite>。点击成功邀请人数旁箭头可滚动至邀请记录；每条成功记录固定奖励88钻石。
