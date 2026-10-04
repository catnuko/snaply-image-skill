# snaply-image JSX 指南

渲染引擎是 [Takumi](https://takumi.kane.tw)（Rust 实现）：把 React 元素树转成节点树，
用内置的 CSS 引擎（flexbox + 文本排版）光栅化。概念上像「一次性的浏览器页面，输出的
是图片而不是截图」。

## 元素与属性

| JSX | 说明 |
| --- | --- |
| `<div>` `<span>` | 容器与文本，`h1`–`h6`、`p`、`strong` 等也按 div/span 处理（自带 preset 样式） |
| `tw="..."` | Tailwind 风格工具类（主推写法） |
| `style={{ ... }}` | 驼峰 CSS 对象，兜底用，如 `style={{ backgroundImage: "linear-gradient(...)" }}` |
| `<img src width height>` | `src` 为公网 URL；`width`/`height` 为数字 |
| `<svg>...</svg>` | 内联 SVG，序列化后转位图渲染，可写 path/circle/gradient 等 |
| `<br />` | 换行 |
| `<style>{\`css\`}</style>` | 自定义 CSS 样式表（如字体栈、复杂选择器） |
| `className` `id` `dir` `lang` | 基础 HTML 属性 |

## tw 支持范围（实测可用的核心集）

- **布局**：`flex`、`flex-col`、`flex-1`、`items-*`、`justify-*`、`gap-*`、
  `flex-wrap`；`w-full`/`h-full`；`max-w-[..]`；`relative`/`absolute` +
  `top/right/bottom/left`；`z-*`；`overflow-hidden`。
- **间距**：`p/px/py/pt...-*`、`m/...-*`（含任意值 `p-[42px]`）。
- **背景**：`bg-[#hex]`、调色板类（`bg-slate-900`、`text-white` 等）、
  `bg-gradient-to-br` + `from-*`/`via-*`/`to-*`、`bg-cover`。
- **圆角/边框/阴影**：`rounded`、`rounded-2xl`、`rounded-full`、
  `border`、`border-[3px]`、`border-[#334155]`、`shadow-lg`。
- **文字**：`text-xs`…`text-9xl`、任意值 `text-[88px]`、`font-light/medium/bold/extrabold`、
  `leading-*`、`tracking-*`、`text-center`、`uppercase`、`italic`、`opacity-*`、
  `line-through`、`text-transparent`（配渐变裁切做花字，用 style 写 backgroundClip）。
- **变换/滤镜**（经 `style` 验证）：`transform: rotate(45deg)`、`scale(1.4)`、
  `filter: blur(3px)`、`filter: drop-shadow(0 6px 12px rgba(...))`。
- **渐变花字**：用 `<style>` 定义 class 后引用：

  ```jsx
  <style>{`
    .grad-text {
      background-image: linear-gradient(90deg, #f472b6, #fbbf24);
      background-clip: text;
      color: transparent;
    }
  `}</style>
  <span tw="grad-text text-5xl font-extrabold">花字</span>
  ```

### 已知地雷（会静默出错，务必避开）

- `backdrop-blur`：静默破坏布局（卡片压窄、文字竖排），用 `bg-white/10` 半透明底替代。
- `--scale` / `devicePixelRatio`：部分 flex 布局在 2x 下排版错乱。要高分辨率直接把
  画布和字号等比写大（引擎是矢量光栅，无损）。

不支持的写法（报错信息会点名）：`grid`、伪类/伪元素（`hover:` 等）、响应式前缀
（`md:`）。遇到报错换成 flex 嵌套实现。

## 图片

- 远程图：`<img src="https://..." width={480} height={480} />`，或
  `style={{ backgroundImage: "url(https://...)", backgroundSize: "cover" }}`。
- 渲染前会下载（走缓存）；URL 404 会直接报错并指出 URL，换图或删掉即可。
- 头像/徽标建议圆形裁切：`tw="rounded-full overflow-hidden"` 的容器包 img。

## 字体

默认家族：**Noto Sans**（拉丁）+ 按文案脚本自动附加 Noto Sans SC/TC/JP/KR、
阿拉伯/希伯来/天城文/泰文，可变字重 100..900，`font-bold` 等类直接生效。
缓存键是 URL，字体文件长期有效，无需手动管理。

额外字体（Google Fonts 任意家族）：

```jsx
export const options = {
  width: 1200, height: 630,
  fonts: ["Inter:400..800", "Noto Serif SC:700"], // "家族:字重"，字重可用区间
};
```

或命令行 `--fonts "Inter:400..800"`（两者会合并）。字体栈解析遵循 CSS 规则，
`font-family: "Noto Serif SC", serif` 可通过 `style` 或 `<style>` 标签使用。

## Emoji

文案里直接写 emoji，渲染成图片贴片。`options.emoji` 可选
`"twemoji" | "blobmoji" | "noto" | "openmoji"`（默认 twemoji）。

## 动画（WebP / GIF / APNG）

`options.animation` 存在时输出动图而不是单帧：

```jsx
export const options = {
  width: 640, height: 360,
  animation: { durationMs: 2400, fps: 24, format: "webp" }, // webp|gif|apng
  keyframes: [
    {
      name: "rise",
      keyframes: [
        { offsets: [0], declarations: { opacity: "0", transform: "translateY(24px)" } },
        { offsets: [1], declarations: { opacity: "1", transform: "translateY(0px)" } },
      ],
    },
  ],
};

export default function Card() {
  return (
    <div tw="h-full w-full flex items-center justify-center bg-[#0b1120]">
      <h1 style={{ animation: "rise 1.2s ease-out both" }} tw="text-5xl text-white">
        Hello 动图
      </h1>
    </div>
  );
}
```

## 常见报错与处理

| 报错关键词 | 原因 / 处理 |
| --- | --- |
| `unsupported style property: xxx` | 该 CSS 属性未实现，换支持的写法 |
| `HTTP 404 ... fetching <url>` | 图片/字体 URL 失效，换 URL |
| `Code must export default a React component function` | 忘了默认导出或导出的不是函数 |
| sucrase / SyntaxError | JSX 语法错误，报错带行列号 |
| `The file must export default...` 但确实导出了 | 文件被 markdown 代码块包裹，或 import 了外部包 |
| 网络错误（离线） | 字体/emoji/图片需要首次联网；`--no-cache` 只影响读取缓存 |

## 设计经验

- 先定信息层级：主标题 1 个、辅助信息 ≤2 层；中文正文行高用 `leading-relaxed` 以上。
- 深色卡片上文字用 `text-slate-100/200`，不要纯白配纯黑背景。
- 品牌感来自克制的配色（1 主色 + 2 灰阶）和留白，而不是元素数量。
- 文字溢出是最常见问题：看图后用 `max-w-*`、缩短文案或减小字号。
- 数据卡片用 div 拼条形图（宽度百分比），比塞 SVG 图表更稳。
