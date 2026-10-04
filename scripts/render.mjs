#!/usr/bin/env node
// snaply-image CLI: renders a single-file JSX component to PNG/JPEG/WebP/SVG
// (or an animated WebP/APNG/GIF) with the Takumi engine — no browser needed.
//
// Usage:
//   node render.mjs <input.jsx> [-o out.png] [--width N] [--height N]
//        [--format png|jpeg|webp|svg] [--quality 75]
//        [--fonts "Inter:400..800,Noto Serif SC"] [--no-cache] [--timeout 30000]

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";

const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const USAGE = `Usage: node render.mjs <input.jsx> [options]

Options:
  -o, --out <path>     output image path (default: next to the input file)
  --width <n>          override render width
  --height <n>         override render height
  --format <fmt>       png | jpeg | webp | svg (default: from options or png)
  --quality <n>        jpeg/webp quality 0-100
  --fonts <spec>       extra Google font families, e.g. "Inter:400..800,Noto Serif SC"
  --no-cache           bypass the on-disk network cache (~/.cache/snaply-image)
  --timeout <ms>       per-request network timeout (default 30000)
  -h, --help           show this help`;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-o" || a === "--out") args.out = argv[++i];
    else if (a === "--width") args.width = Number(argv[++i]);
    else if (a === "--height") args.height = Number(argv[++i]);
    else if (a === "--format") args.format = argv[++i];
    else if (a === "--quality") args.quality = Number(argv[++i]);
    else if (a === "--scale") {
      console.error(
        "error: --scale (devicePixelRatio) is disabled: takumi 2.5.10 lays out some flex layouts incorrectly at non-1x. To get higher resolution, design the component at the final pixel size instead (e.g. width 2400 and doubled font sizes for a 2x OG image).",
      );
      process.exit(2);
    } else if (a === "--fonts") args.fonts = argv[++i];
    else if (a === "--no-cache") args.noCache = true;
    else if (a === "--timeout") args.timeout = Number(argv[++i]);
    else if (a === "-h" || a === "--help") {
      console.log(USAGE);
      process.exit(0);
    } else if (a.startsWith("--")) {
      console.error(`error: unknown option ${a}\n${USAGE}`);
      process.exit(2);
    } else args._.push(a);
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
if (args._.length !== 1) {
  console.error(args._.length === 0 ? `error: missing input file\n${USAGE}` : `error: expected exactly one input file\n${USAGE}`);
  process.exit(2);
}

const inputPath = resolve(args._[0]);
if (!existsSync(inputPath)) {
  console.error(`error: input file not found: ${inputPath}`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Dependencies (auto-install on first use)
// ---------------------------------------------------------------------------

async function ensureDeps() {
  try {
    await import("@takumi-rs/wasm");
    return;
  } catch {}
  console.error("[snaply-image] installing dependencies (first run only)…");
  const res = spawnSync("npm", ["install", "--no-audit", "--no-fund"], {
    cwd: SKILL_DIR,
    stdio: "inherit",
  });
  if (res.status !== 0) {
    console.error(
      `[snaply-image] npm install failed. Run it manually in ${SKILL_DIR} and retry.`,
    );
    process.exit(1);
  }
}
await ensureDeps();

const { default: wasmInit, Renderer, setGlyphCacheMaxBytes } = await import("@takumi-rs/wasm");
const { googleFonts, prepareImages } = await import("takumi-js/helpers");
const { extractEmojis } = await import("takumi-js/helpers/emoji");
const { fromJsx } = await import("takumi-js/helpers/jsx");
const { transform } = await import("sucrase");
const React = (await import("react")).default;

// ---------------------------------------------------------------------------
// Disk cache for network fetches (fonts, images, emoji) keyed by URL
// ---------------------------------------------------------------------------

const CACHE_DIR = join(homedir(), ".cache", "snaply-image");
const cacheEnabled = !args.noCache;

async function cachingFetch(url, init) {
  const href = typeof url === "string" ? url : url instanceof URL ? url.href : url.url;
  if (!cacheEnabled || !/^https?:/.test(href)) return globalThis.fetch(url, init);

  const key = createHash("sha256").update(href).digest("hex");
  const file = join(CACHE_DIR, key);
  if (existsSync(file)) {
    return new Response(await readFile(file), { status: 200 });
  }
  const res = await globalThis.fetch(url, init);
  if (!res.ok) return res;
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(file, buf).catch(() => {});
  return new Response(buf, { status: res.status, statusText: res.statusText, headers: res.headers });
}

// ---------------------------------------------------------------------------
// Evaluate the component file (same pipeline as the snaply website)
// ---------------------------------------------------------------------------

function evaluateComponent(code) {
  const js = transform(code, {
    transforms: ["jsx", "typescript", "imports"],
    production: true,
  }).code;
  const exports = {};
  new Function("exports", "React", js)(exports, React);
  if (typeof exports.default !== "function") {
    throw new Error("The file must `export default` a React component function.");
  }
  return { component: exports.default, options: exports.options ?? {} };
}

// ---------------------------------------------------------------------------
// Fonts: request the default Noto Sans superfamily subsets only for scripts
// actually present in the text, plus any extra user-requested families.
// ---------------------------------------------------------------------------

const DEFAULT_BASE_FAMILY = { name: "Noto Sans", weight: "100..900" };

const SCRIPT_FAMILIES = [
  { name: "Noto Sans SC", weight: "100..900", ranges: [[0x2e80, 0x9fff], [0x3000, 0x303f], [0xff00, 0xffef]] },
  { name: "Noto Sans TC", weight: "100..900", ranges: [[0x2e80, 0x9fff], [0x3000, 0x303f], [0xff00, 0xffef]] },
  { name: "Noto Sans JP", weight: "100..900", ranges: [[0x2e80, 0x9fff], [0x3000, 0x303f], [0xff00, 0xffef], [0x3040, 0x30ff]] },
  { name: "Noto Sans KR", weight: "100..900", ranges: [[0x2e80, 0x9fff], [0x3000, 0x303f], [0xff00, 0xffef], [0xac00, 0xd7af]] },
  { name: "Noto Sans Arabic", weight: "100..900", ranges: [[0x0600, 0x06ff], [0x0750, 0x077f], [0xfb50, 0xfdff], [0xfe70, 0xfeff]] },
  { name: "Noto Sans Hebrew", weight: "100..900", ranges: [[0x0590, 0x05ff]] },
  { name: "Noto Sans Devanagari", weight: "100..900", ranges: [[0x0900, 0x097f]] },
  { name: "Noto Sans Thai", weight: "100..900", ranges: [[0x0e00, 0x0e7f]] },
];

function collectTextCodepoints(node, set = new Set()) {
  const visit = (n) => {
    if (typeof n === "string") {
      for (const ch of n) set.add(ch.codePointAt(0));
    } else if (Array.isArray(n)) {
      n.forEach(visit);
    } else if (n && typeof n === "object") {
      if (n.type === "text" && typeof n.text === "string") visit(n.text);
      if (n.type === "container") (n.children ?? []).forEach(visit);
    }
  };
  visit(node);
  return set;
}

function parseFontSpec(spec) {
  // "Inter" | "Inter:400..800" | "Noto Serif SC:700"
  const idx = spec.indexOf(":");
  if (idx === -1) return { name: spec.trim(), weight: "100..900" };
  const name = spec.slice(0, idx).trim();
  const weight = spec.slice(idx + 1).trim();
  return { name, weight };
}

function resolveFontFamilies(options, node) {
  const extra = [];
  const fromOptions = options.fonts;
  if (Array.isArray(fromOptions)) {
    for (const f of fromOptions) extra.push(typeof f === "string" ? parseFontSpec(f) : f);
  } else if (typeof fromOptions === "string") {
    for (const f of fromOptions.split(",")) extra.push(parseFontSpec(f));
  }
  if (args.fonts) {
    for (const f of args.fonts.split(",")) extra.push(parseFontSpec(f));
  }

  const cps = collectTextCodepoints(node);
  const families = [DEFAULT_BASE_FAMILY, ...extra];
  for (const sf of SCRIPT_FAMILIES) {
    if (sf.ranges.some(([lo, hi]) => [...cps].some((c) => c >= lo && c <= hi))) {
      families.push({ name: sf.name, weight: "100..900" });
    }
  }
  return families;
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

const FORMAT_EXT = { png: "png", jpeg: "jpg", webp: "webp", svg: "svg", apng: "png", gif: "gif" };

function outputFormat(options) {
  if (options.animation) return options.animation.format ?? "webp";
  return options.format ?? "png";
}

function defaultOutputPath(inputPath, format) {
  const ext = FORMAT_EXT[format] ?? "png";
  const base = inputPath.replace(/\.(jsx|tsx|ts|mjs|js)$/i, "");
  return `${base}.${ext}`;
}

async function main() {
  const t0 = Date.now();
  const code = await readFile(inputPath, "utf8");

  const wasmBinary = await readFile(
    new URL("../node_modules/@takumi-rs/wasm/pkg/takumi_wasm_bg.wasm", import.meta.url),
  );
  await wasmInit({ module_or_path: wasmBinary });
  // CJK glyph outlines are a few KB each; raise the shared glyph cache so a
  // page of Chinese doesn't thrash the default 8 MiB budget. Must run after
  // init and before the first render.
  setGlyphCacheMaxBytes(64 * 1024 * 1024);
  const renderer = new Renderer();

  const { component, options } = evaluateComponent(code);
  const element = React.createElement(component);
  let { node, stylesheets } = await fromJsx(element);
  const effectiveStylesheets = options.stylesheets ?? stylesheets;

  node = extractEmojis(node, options.emoji ?? "twemoji");

  const [images, fonts] = await Promise.all([
    prepareImages({ node, fetch: cachingFetch, timeout: args.timeout ?? 30000 }),
    googleFonts({
      families: resolveFontFamilies(options, node),
      fetch: cachingFetch,
      timeout: args.timeout ?? 30000,
    }),
  ]);

  const format = args.format ?? outputFormat(options);
  const width = args.width ?? options.width ?? 1200;
  const height = args.height ?? options.height ?? 630;

  const renderOptions = {
    width,
    height,
    stylesheets: effectiveStylesheets,
    images,
    fonts,
    keyframes: options.keyframes,
    quality: args.quality ?? options.quality,
  };

  const start = Date.now();
  let output;
  if (options.animation) {
    output = await renderer.renderAnimation({
      ...renderOptions,
      scenes: [{ node, durationMs: options.animation.durationMs }],
      fps: options.animation.fps ?? 30,
      format,
    });
  } else {
    output = await renderer.render(node, { ...renderOptions, format });
  }
  const renderMs = Date.now() - start;

  const outPath = resolve(args.out || defaultOutputPath(inputPath, format));
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, output);

  const kb = (output.length / 1024).toFixed(1);
  console.log(
    `OK ${outPath} (${width}x${height} ${format}, ${kb} KB, render ${renderMs} ms, total ${Date.now() - t0} ms)`,
  );
}

try {
  await main();
} catch (error) {
  console.error(`error: ${error?.message ?? error}`);
  if (error?.stack && process.env.SNAPLY_DEBUG) console.error(error.stack);
  process.exit(1);
}
