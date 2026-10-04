// 展示：博客 OG 分享图 — 远程头像图片、自定义 Google 字体（Space Grotesk）、emoji、品牌色强调
export default function OgCard() {
  return (
    <div tw="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0a0a0a] p-14">
      {/* 右上装饰渐变 */}
      <div
        tw="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #f97316 0%, rgba(249,115,22,0) 70%)",
        }}
      />

      <div tw="flex items-center gap-3">
        <div tw="flex h-10 w-10 items-center justify-center rounded-full bg-[#16a34a] text-sm font-bold text-white">
          Z
        </div>
        <span tw="text-lg font-medium text-neutral-400">Zed's Rust Lab</span>
      </div>

      <div tw="flex flex-col gap-6">
        <span tw="text-sm font-semibold tracking-[0.25em] text-[#f97316] uppercase">
          Engineering Blog ⚙️
        </span>
        <h1 tw="m-0 max-w-[1000px] text-6xl font-bold leading-[1.2] text-white">
          用 Rust 写一个<span tw="text-[#f97316]"> JS 引擎</span>
        </h1>
        <p tw="m-0 max-w-[860px] text-2xl leading-relaxed text-neutral-400">
          从 tokenizer 到字节码 VM：一个周末项目的完整拆解，包含 12 张架构图与
          3000 行可运行代码。
        </p>
      </div>

      <div tw="flex items-center justify-between">
        <div tw="flex items-center gap-4">
          <img
            src="https://avatars.githubusercontent.com/u/1?v=4"
            width={72}
            height={72}
          />
          <div tw="flex flex-col gap-1">
            <span tw="text-xl font-semibold text-neutral-100">Tom Preston-Werner</span>
            <span tw="text-lg text-neutral-500">2026 年 9 月 19 日 · 25 分钟阅读</span>
          </div>
        </div>
        <div tw="flex gap-3">
          {["#rustlang", "#编译原理"].map((tag) => (
            <div key={tag} tw="rounded-full bg-neutral-900 px-5 py-2.5">
              <span tw="text-lg text-neutral-300">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const options = {
  width: 1200,
  height: 630,
  format: "png",
  fonts: ["Space Grotesk:400..700"],
};
