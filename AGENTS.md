# Shenma Live Web project rules

These instructions apply to every Codex task in this repository.

## Mock 数据规范

- 页面中使用的 Mock 数据直接展示即可，无需额外添加“模拟数据”“仅供演示”“Mock 数据”等解释性文案。
- 此规范适用于所有现有及未来功能模块，后续功能开发及页面调整默认遵循。

## 中文文案规范

- 本项目为纯中文网站，所有面向用户的页面文案统一使用简体中文。
- 标题、副标题、按钮、标签、提示语等尽量避免英文修饰性文案。
- 品牌名称、技术术语及行业通用缩写（如 NBA、VIP、App）可以保留英文。
- 此规范适用于所有现有及未来功能模块，后续功能开发及页面调整默认遵循。

## Canonical workspace

- The only canonical project and Git root is `/Users/apple/Documents/ChatGPT/Shenma_Live_Web`.
- Before changing files, verify the Git root matches that exact path.
- Home, Live, Preview, Matches, Chat, Search, details, and future pages are modules of this one Web project.
- Do not create or use another project copy, temporary project directory, duplicate repository, or alternate Worktree for ordinary module work.
- Preserve unrelated user changes already present in this shared working tree.

## Unified development server

- Canonical Preview URL: `http://127.0.0.1:4173/`.
- The manual foreground start command is `pnpm dev` from the canonical root.
- Codex tasks must run `pnpm preview:ensure`; it reuses the existing server or starts the single detached `screen` session `shenma_live_web_4173`.
- Vite must use host `127.0.0.1`, port `4173`, and `strictPort: true`.
- Never silently use 4174, 4175, 4176, 3000, 3001, or any other fallback port.
- Before starting, inspect port 4173. If this project already owns the server, reuse it and do not launch a duplicate.
- If another program owns 4173, diagnose the conflict and tell the user; do not switch ports or terminate an unrelated process without authorization.
- Do not launch a separate server for a specific page or module. All routes use the same origin.

## Default completion behavior

After every implementation request:

1. Check the changed code and relevant page for build/runtime errors.
2. Confirm the canonical dev server is reachable at `http://127.0.0.1:4173/`.
3. In the final response, always output `本地预览：http://127.0.0.1:4173/`.
4. If useful, also output the page's direct hash route, but it must use the same host and port.

Read `PREVIEW.md` for the user-facing preview policy and current route list.
