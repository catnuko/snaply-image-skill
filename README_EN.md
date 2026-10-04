# snaply-image

> [English](./README_EN.md) | **中文**

Turn a text description into a well-designed image: write a single-file JSX component and render it to PNG / JPEG / WebP (also SVG and animated WebP / GIF / APNG) with the local [Takumi](https://takumi.rs) engine — **no browser, no website, no cloud service**.

Rendering *is* layout, so you get pixel-level control and can polish the result by iterating: render → look at the image → fix → repeat.

![OG blog card](readme-assets/og-blog-card.png)

## What it's for

- OG / Twitter share cards, WeChat official-account covers, social cards
- Vertical posters, invitations, announcements, report cards
- Programmatic layouts such as weekly data reports and chart cards
- Images composed of layout, text, emoji, brand colors and real image URLs

Not for photo-realistic illustration — that's the territory of text-to-image models.

## Install

This repository **is itself an Agent Skill** (it ships a root `SKILL.md`), so any harness that follows the `SKILL.md` spec can use it directly — CodeBuddy, Claude Code, Codex, Cursor, ZCode, OpenCode, Gemini CLI and 73 more.

### Option 1: one-line install (recommended)

Use the [skills](https://www.npmjs.com/package/skills) CLI — it detects which harnesses you have and installs into them:

```bash
npx skills add catnuko/snaply-image-skill
```

Useful flags:

```bash
# global (user-level) install; without -g it installs project-level
npx skills add catnuko/snaply-image-skill -g

# target specific harnesses (several, or * for all)
npx skills add catnuko/snaply-image-skill -g -a codebuddy claude-code cursor

# non-interactive (scripts / CI)
npx skills add catnuko/snaply-image-skill -g -y

# list available skills without installing
npx skills add catnuko/snaply-image-skill -l

# copy instead of symlink (harness dir on another disk / needs its own copy)
npx skills add catnuko/snaply-image-skill -g --copy
```

That's it — just ask your agent "make me a poster about X" and the skill triggers. No restart needed.

### Option 2: clone into a harness directory

```bash
# universal directory (Codex / Cursor / Cline / Zed / OpenCode / Amp all share this one)
git clone https://github.com/catnuko/snaply-image-skill.git ~/.agents/skills/snaply-image

# or the harness-specific directory
git clone https://github.com/catnuko/snaply-image-skill.git ~/.codebuddy/skills/snaply-image
git clone https://github.com/catnuko/snaply-image-skill.git ~/.claude/skills/snaply-image
git clone https://github.com/catnuko/snaply-image-skill.git ~/.codex/skills/snaply-image
```

Clone once and symlink the rest if you use several harnesses:

```bash
git clone https://github.com/catnuko/snaply-image-skill.git ~/.agents/skills/snaply-image
mkdir -p ~/.codebuddy/skills
ln -s ~/.agents/skills/snaply-image ~/.codebuddy/skills/snaply-image
```

### Where harnesses look for skills

| Harness | User-level (global) | Project-level |
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

The directory name must match `name: snaply-image` in `SKILL.md`, otherwise the harness won't pick it up.

### Dependencies

Rendering dependencies are installed **automatically on first run** (`@takumi-rs/wasm` + `takumi-js` + `react` + `sucrase`), into the skill's own `node_modules/` so they don't affect other skills. To pre-install:

```bash
cd ~/.agents/skills/snaply-image && npm install
```

### Updating

```bash
cd ~/.agents/skills/snaply-image && git pull       # if you cloned manually
npx skills update snaply-image -g                   # if you installed via the CLI
```

## Usage

### 1. Write a component

A file contains exactly one component. Style with the `tw` prop (Tailwind-style utility classes) and control the canvas via `export const options`:

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

The contract:

- Do **not** `import` anything; the component receives no props
- `format` is `"png" | "jpeg" | "webp"`, defaults to png
- Write emoji directly in the text (✨🌙🚀) — Twemoji style, downloaded and cached automatically
- `<img src="https://..." />` accepts any public image URL; inline `<svg>` is rasterized

### 2. Render

```bash
node scripts/render.mjs my-image.jsx -o out.png
```

### 3. Look at it, then iterate

Open the output PNG and check for overflow, contrast, alignment and whitespace, then edit the component and render again. Two or three rounds usually does it.

## CLI

```
node scripts/render.mjs <input.jsx> [-o out.png] [--width N] [--height N]
     [--format png|jpeg|webp|svg] [--quality 75]
     [--fonts "Inter:400..800,Noto Serif SC"] [--no-cache] [--timeout 30000]
```

| Option | Description |
| --- | --- |
| `-o, --out` | Output path; defaults next to the input file, with the extension matching the format |
| `--width` / `--height` | Override the canvas size |
| `--format` | `png` (default) / `jpeg` / `webp` / `svg` |
| `--quality` | JPEG / WebP quality, 0-100 |
| `--fonts` | Extra Google Font families to load |
| `--no-cache` | Bypass the `~/.cache/snaply-image` on-disk cache |
| `--timeout` | Per-request network timeout in ms (default 30000) |

Exit code 0 means success. On failure, the `error:` line on stderr explains why (e.g. an unsupported class name).

## Examples

Sources live in [`examples/`](examples/), rendered outputs in `readme-assets/`.

| | |
| --- | --- |
| ![Mid-autumn poster](readme-assets/poster-mid-autumn.png) | ![Weekly report card](readme-assets/data-report-card.png) |
| ![Invite card](readme-assets/invite-card.png) | ![Animated launch banner](readme-assets/launch-banner-animated.gif) |

- `welcome.jsx` — minimal starting point
- `poster-mid-autumn.jsx` — vertical Chinese-language poster
- `og-blog-card.jsx` — OG share image
- `data-report-card.jsx` — weekly report / bar chart
- `invite-card.jsx` — serif invitation card
- `launch-banner-animated.jsx` — animated GIF

## Fonts and caching

- CJK text works out of the box: the full Noto Sans family (SC / TC / JP / KR, variable weights 100..900) is loaded on demand based on the scripts that actually appear in your copy — no configuration needed
- Other Google Fonts: add `fonts: ["Inter:400..800"]` to `options`, or pass `--fonts "Noto Serif SC"` at render time
- The first render needs network access (Google Fonts, Twemoji, image URLs). After that everything is cached in `~/.cache/snaply-image`, so subsequent renders take roughly 100ms

## Gotchas

- **Do not use `--scale` (devicePixelRatio)**: with takumi 2.5.10, 2x rendering scrambles some flex layouts. For higher resolution, scale the canvas dimensions and font sizes up proportionally instead.
- **Do not use `backdrop-blur`**: it silently breaks layout without raising an error. Use a translucent background color (e.g. `bg-white/10`) for frosted-glass effects.
- The engine supports a **subset** of Tailwind-style CSS. Complex CSS (grid, pseudo-elements, external custom font files, etc.) is partially supported or errors out; the error message points at the offending property.

For more (Tailwind support range, SVG, animated WebP / GIF, keyframes, common errors) see [`references/jsx-guide.md`](references/jsx-guide.md).

## License

MIT