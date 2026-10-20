# typing-game

打字游戏：www.vibe-game.com/typing-game/。像素风的打字打怪：看词打词，打对一个砍史莱姆一刀。

## 系列规范（先读）

本仓库是 Vibe Game 系列的一个游戏。部署、顶栏、版本号、存档键、语言、画风、文风这些跨仓库的规则，只写在 vibe-game 仓库的 `docs/GUIDE.md`，开始工作前先读完：

- 本地：`../vibe-game/docs/GUIDE.md`
- 线上：https://raw.githubusercontent.com/SHKChan/vibe-game/main/docs/GUIDE.md

两处都读不到时，先停下来问用户要这份规范，不要凭记忆或猜测去改跨仓库的东西。本文件只写本仓库的参数、玩法和例外；和 GUIDE 冲突时以 GUIDE 为准，除非下面明确写了“例外”。设计子代理（game / narrative / economy / level designer）在 vibe-game 的 `.claude/agents/`，需要时按 GUIDE 第十三节去读。

## 本仓库参数

| 项 | 值 |
|---|---|
| 网址 | https://www.vibe-game.com/typing-game/ |
| 路径 / Worker | `typing-game` |
| 生产分支 | `main`（推送即部署） |
| 打包 | `node tools/build.js` → `dist/typing-game/`；新增运行时文件要加进 `FILES` |
| 版本号 | `index.html` 的 `<meta name="vg:version">` |
| 存档键 | `typing-game.*` |

## 本游戏

- 全部代码在 `index.html` 一个文件里：`WORDS` 词库、`STAGES` 五关（词长、血量、每词限时，最后一关是魔王）、`BADGES` 徽章。
- 存档键：`typing-game.bestTime`（最快通关秒数）、`typing-game.badges`。网址以前是 `/arthur/`，旧的 `arthur.*` 记录在第一次打开时拷过来，这段迁移代码不要删。
- **例外：界面是英文。** 练的是英文单词，提示文字也用英文；GUIDE 的“只显示中文”不适用于本游戏。
- 手机上键盘弹出时要保证怪物、单词、输入框都看得见（`visualViewport` 那段）。
