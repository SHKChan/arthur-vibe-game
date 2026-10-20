# typing-game

www.vibe-game.com/typing-game/ 的打字游戏。纯静态，`node tools/build.js` 打包到 `dist/typing-game/`，推送到 main 由 Cloudflare Worker `typing-game` 自动部署。

- 部署规则：先读 `cloudflare-deploy-guide.md`
- 顶栏（游戏列表、版本号、问题反馈、定时提醒）由全站的 `/nav.js` 提供，不做底栏；版本号写在 `index.html` 的 `<meta name="vg:version">`，发布新内容时改（首页会自己读）
- 全系列约定（顶栏、版本号、主题、语言等）：https://github.com/SHKChan/vibe-game/blob/main/docs/GUIDE.md
