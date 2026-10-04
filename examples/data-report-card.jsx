// 展示：数据周报卡片 — 浅色排版、flex 柱状图、大数字 KPI、emoji
const DAYS = [
  { d: "周一", v: 34 },
  { d: "周二", v: 52 },
  { d: "周三", v: 41 },
  { d: "周四", v: 66 },
  { d: "周五", v: 88 },
  { d: "周六", v: 74 },
  { d: "周日", v: 61 },
];

const KPIS = [
  { label: "日活跃用户", value: "48.2k", delta: "↑ 12.4%" },
  { label: "次周留存", value: "41.5%", delta: "↑ 3.2pct" },
  { label: "NPS", value: "57", delta: "↑ 6" },
];

export default function WeeklyReport() {
  const max = Math.max(...DAYS.map((x) => x.v));
  return (
    <div tw="flex h-full w-full flex-col justify-between bg-[#fafaf9] p-16">
      <div tw="flex items-center justify-between">
        <div tw="flex flex-col gap-2">
          <span tw="text-base font-semibold tracking-[0.3em] text-emerald-600 uppercase">
            Weekly Report 📈
          </span>
          <h1 tw="m-0 text-5xl font-bold text-stone-900">产品数据周报 · 第 37 周</h1>
        </div>
        <div tw="rounded-2xl bg-emerald-50 px-6 py-3">
          <span tw="text-lg font-medium text-emerald-700">9.14 – 9.20</span>
        </div>
      </div>

      <div tw="flex gap-6">
        {KPIS.map((k) => (
          <div
            key={k.label}
            tw="flex flex-1 flex-col gap-2 rounded-3xl border border-stone-200 bg-white p-8"
          >
            <span tw="text-lg text-stone-500">{k.label}</span>
            <span tw="text-6xl font-bold tracking-tight text-stone-900">{k.value}</span>
            <span tw="text-lg font-semibold text-emerald-600">{k.delta}</span>
          </div>
        ))}
      </div>

      <div tw="flex flex-col gap-6 rounded-3xl border border-stone-200 bg-white p-10">
        <span tw="text-xl font-semibold text-stone-700">每日活跃趋势</span>
        <div tw="flex h-56 items-end justify-between gap-4">
          {DAYS.map((x) => (
            <div key={x.d} tw="flex flex-1 flex-col items-center gap-3">
              <span tw="text-base font-semibold text-stone-400">{x.v}k</span>
              <div
                tw="w-full rounded-t-lg"
                style={{
                  height: `${(x.v / max) * 150}px`,
                  background:
                    x.v === max
                      ? "linear-gradient(180deg, #10b981, #059669)"
                      : "#e7e5e4",
                }}
              />
              <span
                tw="text-base"
                style={{ color: x.v === max ? "#059669" : "#a8a29e" }}
              >
                {x.d}
              </span>
            </div>
          ))}
        </div>
      </div>

      <span tw="text-base text-stone-400">
        由 snaply-image 生成 · 每周五自动推送到团队群 🤖
      </span>
    </div>
  );
}

export const options = {
  width: 1080,
  height: 1080,
  format: "png",
};
