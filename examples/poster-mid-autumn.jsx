// 展示：中文竖版海报 — 渐变夜空、CSS 月亮辉光、内联 SVG 山影、emoji、可变字重
export default function MidAutumn() {
  return (
    <div tw="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#0f172a]">
      {/* 月亮 + 辉光 */}
      <div tw="absolute top-24 right-24 h-44 w-44 rounded-full bg-[#fcd34d] shadow-[0_0_120px_40px_rgba(252,211,77,0.35)]">
        <div tw="absolute left-8 top-10 h-7 w-7 rounded-full bg-[#fbbf24]" />
        <div tw="absolute right-9 top-20 h-5 w-5 rounded-full bg-[#fbbf24]" />
        <div tw="absolute left-16 bottom-8 h-4 w-4 rounded-full bg-[#fbbf24]" />
      </div>
      {/* 星星 */}
      <div tw="absolute left-16 top-32 h-1.5 w-1.5 rounded-full bg-white" />
      <div tw="absolute left-40 top-52 h-2 w-2 rounded-full bg-white opacity-70" />
      <div tw="absolute right-56 top-44 h-1.5 w-1.5 rounded-full bg-white opacity-80" />
      <div tw="absolute left-72 top-28 h-1 w-1 rounded-full bg-white opacity-60" />
      <div tw="absolute right-40 top-[420px] h-1.5 w-1.5 rounded-full bg-white opacity-50" />
      <div tw="absolute left-24 top-[500px] h-1 w-1 rounded-full bg-white opacity-70" />

      <div tw="flex flex-col items-center gap-7 px-16">
        <span tw="text-sm font-medium tracking-[0.55em] text-amber-300/90 uppercase">
          Mid-Autumn Festival
        </span>
        <h1 tw="m-0 text-center text-[110px] font-extrabold leading-none tracking-wide text-amber-50">
          中秋团圆
        </h1>
        <p tw="m-0 text-center text-2xl leading-loose text-indigo-200">
          花好月圆人长久
          <br />
          人间万事消磨尽
        </p>
        <div tw="mt-3 flex items-center gap-3 rounded-full border border-amber-200/30 bg-white/5 px-7 py-3">
          <span tw="text-lg text-amber-100">九月廿五 · 阖家安康 🥮</span>
        </div>
      </div>

      {/* 内联 SVG 山影 */}
      <svg
        width={800}
        height={220}
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1e1b4b" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <path d="M0 220 L0 150 L120 90 L260 160 L400 70 L560 150 L680 100 L800 150 L800 220 Z" fill="url(#hill)" />
      </svg>
      <span tw="absolute bottom-9 right-12 text-xl">🐇</span>
    </div>
  );
}

export const options = {
  width: 800,
  height: 1200,
  format: "png",
};
