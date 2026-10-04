---
name: snaply-image
description: >-
  把文字描述变成一张设计好的图片：写一个单文件 JSX 组件，用本地 Takumi 引擎渲染成
  PNG / JPEG / WebP（也支持 SVG 和动画 WebP/GIF/APNG），无需浏览器、无需网站。
  凡用户想"生成图片 / 画一张图 / 做海报 / 封面图 / OG 分享图 / social card /
  banner / 邀请函 / 带文字排版的图片 / 公告图 / 成绩单或数据卡片截图"时都应使用本技能，
  即使用户没提 "snaply" 或 "JSX"。适合由布局、文字、emoji、品牌色、真实图片 URL 组成的
  程序化图片；不适合生成照片级插画（那是文生图模型的领域）。
---

# snaply-image：用 JSX 生成图片

网站版 snaply 的核心能力已搬到本地：你写一个 React 组件（样式用 Tailwind 类风格的
`tw` 属性），CLI 用 Takumi 引擎把它渲染成图片。渲染即布局，所以你能精确控制每个
像素，并通过反复「渲染 → 看图 → 修改」来打磨结果。

## 工作流

1. **定画布**：根据用途选尺寸。OG 分享图 1200x630；Twitter/X 卡片 1200x675；
   竖版海报 1080x1350 或 800x1200；公众号封面 900x383；方形 1080x1080。
2. **写组件**：把组件写到目标目录下的 `.jsx` 文件（如 `./og-image.jsx`），文件结构
   必须满足下面的「组件契约」。
3. **渲染**：`node <skill目录>/scripts/render.mjs <文件.jsx> -o <输出.png>`
   （skill 目录即本文件所在目录）。首次运行会自动装依赖并联网拉取字体/emoji（之后有
   磁盘缓存，二次渲染约 100ms）。
4. **必须看图**：用 Read 工具查看输出的 PNG，检查溢出、对比度、对齐、留白。
5. **迭代**：发现问题就改组件再渲染，通常 1-3 轮即可定稿。把这一步当作真实的设计
   审校，而不是走过场。

## 组件契约

- 文件里有且只有一个组件：`export default function Xxx() { ... }`。
- 用 `export const options` 控制画布：`{ width, height, format }`，format 为
  `"png" | "jpeg" | "webp"`（默认 png）。
- 用 `tw` 属性写样式（等价于 className，支持 Tailwind 风格工具类，含
  `text-[#38bdf8]` 这类任意值）。也可用 `style={{ camelCaseCss: value }}` 兜底。
- **不要 import 任何东西**；组件不接收 props；不要用 markdown 代码块包住文件内容。
- 可以用 hooks（useState/useMemo 等，渲染时取初始值）和 async 子组件，但静态图
  通常用不上；保持组件为纯渲染逻辑最稳。

示例见 `examples/`：`welcome.jsx`（最小入门）、`poster-mid-autumn.jsx`（中文竖版海报）、
`og-blog-card.jsx`（OG 分享图）、`data-report-card.jsx`（数据周报/柱状图）、
`invite-card.jsx`（衬线邀请函）、`launch-banner-animated.jsx`（动画 GIF）。这些示例的
渲染成品见本仓库 `readme-assets/`。

## CLI 速查

```
node scripts/render.mjs <input.jsx> [-o out.png] [--width N] [--height N]
     [--format png|jpeg|webp|svg] [--quality 75]
     [--fonts "Inter:400..800,Noto Serif SC"] [--no-cache] [--timeout 30000]
```

- `-o` 缺省时输出到输入文件旁边，扩展名随格式。
- 退出码 0 成功；失败时 stderr 的 `error:` 行会给出具体原因（如不支持的类名）。

## 字体、emoji、图片

- 中文默认用 Noto Sans 全家族（含 SC/TC/JP/KR，100..900 可变字重），按文案里实际
  出现的脚本按需加载并缓存，无需任何配置。
- 想用其他 Google 字体：在 `options` 里加 `fonts: ["Inter:400..800"]`，或渲染时
  `--fonts "Noto Serif SC"`。详见 references/jsx-guide.md。
- emoji 直接写进文案（如 ✨🌙🚀），默认 Twemoji 风格，自动下载并缓存。
- `<img src="https://..." />` 支持任意公网图片 URL；`backgroundImage: url(...)`
  也可以。内联 `<svg>` 会被转成位图渲染。

更多能力（Tailwind 支持范围、SVG、动画 WebP/GIF、keyframes、常见报错）见
**references/jsx-guide.md** —— 写复杂构图、动画或遇到渲染报错时先读它。

## 注意

- **不要用 `--scale`（devicePixelRatio）**：takumi 2.5.10 在部分 flex 布局下会让 2x
  渲染排版错乱（卡片压窄、文字竖排）。要更高分辨率就直接把画布尺寸和字号等比写大。
- **不要用 `backdrop-blur`**：它会静默破坏布局而不报错；毛玻璃效果用半透明底色
  （如 `bg-white/10`）替代。
- 首次渲染需要联网（Google Fonts、Twemoji、图片 URL）；之后走
  `~/.cache/snaply-image` 缓存。离线时若缓存未命中会报网络错误，先补缓存或换素材。
- 引擎支持的是 Tailwind 风格的**子集**：复杂的 CSS（grid、伪元素、外部自定义字体
  文件等）部分支持或报错，报错信息会指明问题属性；换一种写法或查 guide 即可。
- 这不是文生图模型：照片级的"画"用本技能做不到，但"设计一张图"（排版、卡片、海报、
  数据可视化风格的图）正是它的强项。
