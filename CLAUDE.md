# typing-game

www.vibe-game.com/arthur/ 的打字游戏。纯静态，`node tools/build.js` 打包到 `dist/arthur/`，推送到 main 由 Cloudflare Worker `arthur-vibe-game` 自动部署。

- 部署规则：先读 `cloudflare-deploy-guide.md`
- 顶栏、底栏、定时提醒由全站的 `/nav.js` 提供；版本号写在 `index.html` 的 `<meta name="vg:version">`，发布新内容时改
- 全系列约定（顶栏、版本号、主题、语言等）：https://github.com/SHKChan/vibe-game/blob/main/docs/GUIDE.md
