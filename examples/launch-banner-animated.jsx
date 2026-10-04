// 展示：动画 GIF — keyframes + renderAnimation、内联 SVG logo、辉光脉冲
export default function LaunchBanner() {
  return (
    <div tw="relative flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#0e7490] to-[#155e75]">
      <div tw="absolute left-14 top-12 h-1.5 w-1.5 rounded-full bg-cyan-200 opacity-80" />
      <div tw="absolute right-20 top-24 h-1 w-1 rounded-full bg-white opacity-70" />
      <div tw="absolute right-40 bottom-16 h-1.5 w-1.5 rounded-full bg-cyan-100 opacity-60" />

      <div tw="flex items-center gap-6">
        <div style={{ animation: "breathe 1.6s ease-in-out infinite alternate" }}>
          <svg width={88} height={88}>
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#67e8f9" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="80" height="80" rx="24" fill="url(#lg)" />
            <path d="M28 60 L44 26 L60 60 Z" fill="#0c4a6e" />
            <circle cx="52" cy="34" r="6" fill="#fbbf24" />
          </svg>
        </div>
        <div tw="flex flex-col gap-3">
          <h1
            tw="m-0 text-7xl font-extrabold text-white"
            style={{ animation: "rise 1.2s ease-out both" }}
          >
            Snaply 图片引擎
          </h1>
          <span tw="text-2xl text-cyan-100" style={{ animation: "fade 1.8s ease-out both" }}>
            写一段 JSX，得到一张图 ✨
          </span>
        </div>
      </div>

      <div
        tw="rounded-full bg-[#fbbf24] px-9 py-3.5"
        style={{ animation: "pulse 0.9s ease-in-out infinite alternate" }}
      >
        <span tw="text-2xl font-bold text-[#78350f]">PNG · OG · 海报 · 动图 🚀</span>
      </div>
    </div>
  );
}

export const options = {
  width: 800,
  height: 400,
  animation: { durationMs: 2400, fps: 20, format: "gif" },
  keyframes: [
    {
      name: "rise",
      keyframes: [
        { offsets: [0], declarations: { opacity: "0", transform: "translateY(28px)" } },
        { offsets: [1], declarations: { opacity: "1", transform: "translateY(0px)" } },
      ],
    },
    {
      name: "fade",
      keyframes: [
        { offsets: [0], declarations: { opacity: "0" } },
        { offsets: [1], declarations: { opacity: "1" } },
      ],
    },
    {
      name: "breathe",
      keyframes: [
        { offsets: [0], declarations: { transform: "scale(1)" } },
        { offsets: [1], declarations: { transform: "scale(1.12)" } },
      ],
    },
    {
      name: "pulse",
      keyframes: [
        { offsets: [0], declarations: { transform: "scale(1)" } },
        { offsets: [1], declarations: { transform: "scale(1.08)" } },
      ],
    },
  ],
};
