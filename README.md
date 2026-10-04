# snaply-image

> **中文** | [English](./README_EN.md)

把文字描述变成一张设计好的图片：写一个单文件 JSX 组件，用本地 [Takumi](https://takumi.rs) 引擎渲染成 PNG / JPEG / WebP（也支持 SVG 和动画 WebP / GIF / APNG），**无需浏览器、无需网站、无需云服务**。

渲染即布局，所以你能精确控制每个像素，并通过反复「渲染 → 看图 → 修改」来打磨结果。

![OG blog card](readme-assets/og-blog-card.png)

## 适合什么

- OG / Twitter 分享图、公众号封面、social card
- 竖版海报、邀请函、公告图、成绩单
- 数据周报 / 图表卡片这类程序化排版
- 由布局、文字、emoji、品牌色、真实图片 URL 组成的图

不适合照片级插画（那是文生图模型的领域）。

## 安装

本仓库**本身就是一个 Agent Skill**（根目录含 `SKILL.md`），任何遵循 `SKILL.md` 规范的
harness（CodeBuddy、Claude Code、Codex、Cursor、ZCode、OpenCode、Gemini CLI… 共 79 种）都能直接用。

### 方式一：一键安装（推荐）

用 [skills](https://www.npmjs.com/package/skills) CLI，自动识别本机已装的 harness 并装进去：

```bash
npx skills add catnuko/snaply-image-skill
```

常用参数：

```bash
# 全局安装（默认装到项目级，加 -g 装到用户级）
npx skills add catnuko/snaply-image-skill -g

# 指定 harness（可多个，或用 * 表示全部）
npx skills add catnuko/snaply-image-skill -g -a codebuddy claude-code cursor

# 免交互（适合脚本 / CI）
npx skills add catnuko/snaply-image-skill -g -y

# 只看仓库里有哪些技能，不装
npx skills add catnuko/snaply-image-skill -l

# 拷贝而非软链（harness 目录在别的磁盘 / 需要独立副本时用）
npx skills add catnuko/snaply-image-skill -g --copy
```

装完直接对 Agent 说「帮我生成一张 XX 海报」就会触发，无需重启。

### 方式二：手动克隆到 harness 目录

```bash
# 通用目录（Codex / Cursor / Cline / Zed / OpenCode / Amp 等共用这一个）
git clone https://github.com/catnuko/snaply-image-skill.git ~/.agents/skills/snaply-image

# 或各家自己的目录
git clone https://github.com/catnuko/snaply-image-skill.git ~/.codebuddy/skills/snaply-image
git clone https://github.com/catnuko/snaply-image-skill.git ~/.claude/skills/snaply-image
git clone https://github.com/catnuko/snaply-image-skill.git ~/.codex/skills/snaply-image
```

想省事可以只克隆一次，然后软链给其他 harness：

```bash
git clone https://github.com/catnuko/snaply-image-skill.git ~/.agents/skills/snaply-image
mkdir -p ~/.codebuddy/skills
ln -s ~/.agents/skills/snaply-image ~/.codebuddy/skills/snaply-image
```

### 常见 harness 的技能目录

| Harness | 用户级（全局） | 项目级 |
| --- | --- | --- |
| CodeBuddy | `~/.codebuddy/skills/` | `.codebuddy/skills/` |
| ZCode | `~/.zcode/skills/` | `.zcode/skills/` |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex | `~/.codex/skills/` | `.agents/skills/` |
| Cursor | `~/.cursor/skills/` | `.agents/skills/` |
| Cline / Zed / Amp | `~/.agents/skills/` | `.agents/skills/` |
| OpenCode | `~/.config/opencode/skills/` | `.agents/skills/` |
| Gemini CLI | `~/.gemini/skills/` | `.agents/skills/` |
| GitHub Copilot | `~/.copilot/skills/` | `.agents/skills/` |
| Trae | `~/.trae/skills/` | `.trae/skills/` |
| Roo Code | `~/.roo/skills/` | `.roo/skills/` |
| Kilo Code | `~/.kilo/skills/` | `.agents/skills/` |
| iFlow CLI | `~/.iflow/skills/` | `.iflow/skills/` |

目录名必须与 `SKILL.md` 里的 `name: snaply-image` 一致，否则 harness 认不出来。

### 依赖

渲染依赖在**首次运行时自动安装**（`@takumi-rs/wasm` + `takumi-js` + `react` + `sucrase`），
装进技能目录自己的 `node_modules/`，不影响其它技能。也可以提前手动装：

```bash
cd ~/.agents/skills/snaply-image && npm install
```

### 更新

```bash
cd ~/.agents/skills/snaply-image && git pull      # 手动克隆的
npx skills update snaply-image -g # 用 skills CLI 装的
```

## 用法

### 1. 写一个组件

文件里有且只有一个组件，用 `tw` 属性写样式（Tailwind 风格工具类），通过 `export const options` 控制画布：

```jsx
export const options = { width: 1200, height: 630, format: "png" };

export default function OgImage() {
  return (
    <div tw="w-full h-full flex items-center justify-center bg-[#0b1020] text-white">
      <h1 tw="text-6xl font-bold">Hello Snaply</h1>
    </div>
  );
}
```

约定：

- 不要 `import` 任何东西；组件不接收 props
- `format` 为 `"png" | "jpeg" | "webp"`，默认 png
- emoji 直接写进文案（✨🌙🚀），默认 Twemoji 风格，自动下载缓存
- `<img src="https://..." />` 支持任意公网图片 URL，内联 `<svg>` 会被转成位图

### 2. 渲染

```bash
node scripts/render.mjs my-image.jsx -o out.png
```

### 3. 看图，然后迭代

打开输出的 PNG 检查溢出、对比度、对齐、留白，改组件再渲染。通常 1-3 轮定稿。

## CLI

```
node scripts/render.mjs <input.jsx> [-o out.png] [--width N] [--height N]
     [--format png|jpeg|webp|svg] [--quality 75]
     [--fonts "Inter:400..800,Noto Serif SC"] [--no-cache] [--timeout 30000]
```

| 参数 | 说明 |
| --- | --- |
| `-o, --out` | 输出路径，缺省时输出到输入文件旁边，扩展名随格式 |
| `--width` / `--height` | 覆盖画布尺寸 |
| `--format` | `png`（默认）/ `jpeg` / `webp` / `svg` |
| `--quality` | jpeg / webp 质量 0-100 |
| `--fonts` | 额外加载的 Google 字体族 |
| `--no-cache` | 跳过 `~/.cache/snaply-image` 磁盘缓存 |
| `--timeout` | 单次网络请求超时，默认 30000ms |

退出码 0 表示成功；失败时 stderr 的 `error:` 行会给出具体原因（如不支持的类名）。

## 示例

源码在 [`examples/`](examples/)，成品在 `readme-assets/`。

| | |
| --- | --- |
| ![Mid-autumn poster](readme-assets/poster-mid-autumn.png) | ![Weekly report card](readme-assets/data-report-card.png) |
| ![Invite card](readme-assets/invite-card.png) | ![Animated launch banner](readme-assets/launch-banner-animated.gif) |

- `welcome.jsx` — 最小入门
- `poster-mid-autumn.jsx` — 中文竖版海报
- `og-blog-card.jsx` — OG 分享图
- `data-report-card.jsx` — 数据周报 / 柱状图
- `invite-card.jsx` — 衬线邀请函
- `launch-banner-animated.jsx` — 动画 GIF

## 字体与缓存

- 中文默认用 Noto Sans 全家族（含 SC / TC / JP / KR，100..900 可变字重），按文案里实际出现的脚本按需加载，无需任何配置
- 其他 Google 字体：在 `options` 里加 `fonts: ["Inter:400..800"]`，或渲染时 `--fonts "Noto Serif SC"`
- 首次渲染需要联网（Google Fonts、Twemoji、图片 URL），之后走 `~/.cache/snaply-image` 缓存，二次渲染约 100ms

## 踩坑提醒

- **不要用 `--scale`（devicePixelRatio）**：takumi 2.5.10 在部分 flex 布局下会让 2x 渲染排版错乱。要更高分辨率就把画布尺寸和字号等比写大
- **不要用 `backdrop-blur`**：它会静默破坏布局而不报错。毛玻璃效果用半透明底色（如 `bg-white/10`）替代
- 引擎支持的是 Tailwind 风格的**子集**：复杂 CSS（grid、伪元素、外部自定义字体文件等）部分支持或报错，报错信息会指明问题属性

更多能力（Tailwind 支持范围、SVG、动画 WebP / GIF、keyframes、常见报错）见 [`references/jsx-guide.md`](references/jsx-guide.md)。

## License

MIT