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

- 全部代码在 `index.html` 一个文件里：`WORDS` 词库、`WORLDS` 三个世界（每个 5 关：词长、血量、每词限时 = `base + per × 词长`、怪物 `mon`、场景 `scene`；第 5 关是魔王，`rage` 是发怒阶段和特殊词 `spell`）、`MONSTERS` 怪物（像素图、配色、待机动作）、`SCENES` / `SCENE_FX` 像素场景和火光、`BADGES` 徽章、`STR` 界面文字（中英两套）、`SFX` 音效。
- 一局打一个世界，3 颗心；打倒魔王解锁下一个世界。关卡显示成“1-3”。开始前 ← → 选世界，1–3 直接开打，其他键开打选中的。`?world=N` 临时打开世界 N（测试用，不保存）。
- 新世界：在 `WORLDS` 加一项、`MONSTERS` 加怪物、`SCENES` 加场景、`STR` 两种语言都加名字和 `win` 文案；存档 `best` 数组跟着变长。
- 玩法：边打边检查，打错的字母打不进去；打完自动出刀；只有超时扣心。连击每 8 回一颗心，快速无错打完算暴击。
- 画面：一张 112×52 的画布，按整数倍放大（手机 3 倍、电脑 4 倍、键盘弹出或屏幕矮时 2 倍）。比 GUIDE 建议的 240×110 小，是为了手机上能整数倍放大，用户确认过。
- 存档键：`typing-game.save.v1`（`{ unlocked: 已解锁世界数, world: 上次选的世界, best: [每个世界最快秒数] }`）、`typing-game.badges`、`typing-game.sound`（`on`/`off`）。`typing-game.bestTime2` 是 v2 的最快通关（=世界 1），第一次打开时拷进 `best[0]`，世界 1 出新纪录时也照写，方便回退。有 `hero` 徽章的老玩家直接解锁世界 2。`typing-game.bestTime` 是 v1 规则的旧记录，保留不读。网址以前是 `/arthur/`，旧的 `arthur.*` 记录在第一次打开时拷过来，这段迁移代码不要删。
- **例外：界面语言跟浏览器。** `navigator.languages` 第一个以 `zh` 开头显示中文，其他显示英文；`?lang=en` / `?lang=zh` 可强制（测试用，不保存）。要打的单词始终是英文。不读写 `vibe.lang`。GUIDE 的“只显示中文”不适用于本游戏（GUIDE 里还写着“界面是英文”，没改，以这里为准）。
- 手机上键盘弹出时要保证怪物、单词、输入框都看得见（`fit()` 和 `visualViewport` 那段）。
- 更新日志：`CHANGELOG.md`。
- `tools/package.json` 写着 `"type": "commonjs"`，防止上层目录的 `package.json` 把 `build.js` 当成 ES 模块，不要删。
