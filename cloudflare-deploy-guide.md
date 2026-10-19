# Cloudflare 部署约定（typing-game）

> 给负责这个仓库的 Agent 看。你要保证：**推送到 `main` 之后，Cloudflare 能自动构建、部署成功，游戏能在 `https://www.vibe-game.com/arthur/` 正常打开。**

---

## 1. 整体结构：一个游戏 = 一个仓库 = 一个 Worker

| 仓库 | Cloudflare Worker | 挂在哪 | 说明 |
|---|---|---|---|
| `SHKChan/vibe-game` | `vibe-game` | 自定义域名 `www.vibe-game.com`（兜底所有路径） | 总页面（游戏列表）+ 全站顶栏 `/nav.js` |
| `SHKChan/life-sim` | `life-sim` | 路由 `www.vibe-game.com/life-sim*` | 浮生录 |
| `SHKChan/typing-game`（**本仓库**） | `arthur-vibe-game` | 路由 `www.vibe-game.com/arthur*` | 本游戏 |

- **路由比自定义域名先匹配。** 访问 `/arthur/...` 会进入本仓库的 Worker，其他路径（`/`、`/nav.js`、`/life-sim/`）由别的 Worker 处理，互不影响。
- 每个 Worker 都开着 **Workers Builds**，连的是自己的仓库，推送到 `main` 就会自动构建和部署。
- **`arthur`** 是本游戏的网址路径。上线以后不能改。
  - 命名规则：只用小写英文和连字符（古风游戏可以用拼音）。
  - 不能是别的 slug 的前缀，例如 `life` 会把 `life-sim` 的请求也吃掉。
  - 本仓库的 slug：**`arthur`**

---

## 2. 关键：Worker 收到的是完整路径

请求 `www.vibe-game.com/arthur/index.html` 时，Worker 会去静态资源里找 **`/arthur/index.html`**，不是 `/index.html`。

所以上传的目录（`dist/`）**必须多套一层 `arthur/`**：

```
dist/
└── arthur/
    ├── index.html
    └── ...（其他 js / css / 图片）
```

- ❌ 直接上传仓库根目录 → 访问 `/arthur/` 会 404。
- ✅ `dist/arthur/index.html` 存在 → 访问 `/arthur` 自动跳转到 `/arthur/`，然后打开 index.html。

life-sim 的做法相同：`node share/tools/build.js --base=life-sim` 会输出到 `dist/life-sim/`。

---

## 3. 本仓库的打包方式

本仓库是纯静态的，没有构建器。`tools/build.js` 是一个拷贝脚本：

- 把 `FILES` 列表里的文件拷到 `dist/arthur/`。
- **新增运行时文件（js / css / 图片目录）时，必须加进 `FILES`**，否则线上会 404。
- `SLUG = 'arthur'` 要和 Cloudflare 路由保持一致，上线后不要改。

另外：

- `dist/` 已经写进 `.gitignore`，不要提交。
- **不要**在仓库里放 `wrangler.jsonc` / `wrangler.toml`。所有参数都写在 Cloudflare 的命令里，和 life-sim 保持一致。

---

## 4. Cloudflare 上的设置（由用户在 Dashboard 填）

Worker `arthur-vibe-game` → Settings → Build：

| 项 | 值 |
|---|---|
| Build command | `node tools/build.js` |
| Deploy command | `npx wrangler deploy --name arthur-vibe-game --assets ./dist --compatibility-date=2025-06-01` |
| Root directory | `/` |
| Build watch paths | 默认 `*` 即可 |

Worker `arthur-vibe-game` → Domains & Routes → 添加 Route：

- Zone：`vibe-game.com`
- Route：`www.vibe-game.com/arthur*`

**三处名字必须对上：**

1. `--name` = Worker 名 `arthur-vibe-game`，不一致会报 name mismatch。
2. `tools/build.js` 里的 `SLUG` = Route 里的路径。
3. `--assets ./dist` = build 脚本的输出目录。

---

## 5. 游戏代码里的路径规则

- **本游戏自己的文件，一律用相对路径**：`./game.js`、`assets/bg.png`。
  - ❌ 不要写 `/game.js`，它会去找 `www.vibe-game.com/game.js`，那个请求归 vibe-game 的 Worker 处理，结果是 404。
- **全站共用的文件用 `/` 开头**：唯一的例子是顶栏 `<script src="/nav.js" defer></script>`，它由 vibe-game 的 Worker 提供。
- `localStorage` 的键名要加游戏前缀（例如 `arthur.save.v1`），因为整个域名下所有游戏共用一个 localStorage。
  - 本游戏的最快通关时间存在 `arthur.bestTime`（秒）。
  - 例外：`vibe.lang` 是全站共用的语言设置，保持不变。

---

## 6. 上线时还要改另一个仓库（vibe-game）

新游戏要出现在总页面和顶栏上，需要在 **`SHKChan/vibe-game`** 里改两处（没有权限的话，把改动内容交给用户）：

- `public/nav.js`：在 `GAMES` 里加 `{ path: '/arthur/', name: { zh: '…', en: '…', ja: '…', es: '…' } }`。
- `public/index.html`：仿照 life-sim 的写法，加一个 `<a class="game" href="/arthur/">`。

全系列的共同约定（顶栏、底部栏、版本号、主题、语言、画风、检查方法）写在 `vibe-game/docs/GUIDE.md`。做功能之前先读一遍。

---

## 7. 每次推送前的检查清单

- [ ] `node tools/build.js` 能成功执行，生成 `dist/arthur/index.html`
- [ ] 新增的运行时文件都已经加进 `FILES`
- [ ] 本地预览，确认在子路径下能打开、没有 404：
  ```
  npx wrangler dev --assets ./dist --compatibility-date=2025-06-01
  # 然后打开 http://localhost:8787/arthur/
  ```
  （`/nav.js` 在本地是 404，这是正常的，线上由 vibe-game 的 Worker 提供）
- [ ] 代码里没有以 `/` 开头的本游戏资源路径（`/nav.js` 除外）
- [ ] 推送后，在 Cloudflare 的 Deployments 页面确认构建成功，然后打开 `https://www.vibe-game.com/arthur/` 实际验证

---

## 8. 交付时告诉用户

```
Worker:         arthur-vibe-game
Build command:  node tools/build.js
Deploy command: npx wrangler deploy --name arthur-vibe-game --assets ./dist --compatibility-date=2025-06-01
Route:          www.vibe-game.com/arthur*
访问地址:        https://www.vibe-game.com/arthur/
（已在 vibe-game 的 nav.js 和首页加上本游戏）
```
