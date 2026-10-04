// 展示：邀请函 — Noto Serif SC 衬线字体、米色浅排版、双线框、SVG 花饰
export default function Invite() {
  return (
    <div tw="flex h-full w-full items-center justify-center bg-[#f6f1e7] p-10">
      <div tw="flex h-full w-full flex-col items-center justify-between border border-[#b08d57] p-4">
        <div tw="flex h-full w-full flex-col items-center justify-between border border-[#b08d57]/50 px-16 py-14">
          <div tw="flex flex-col items-center gap-4">
            <svg width={72} height={24}>
              <line x1="0" y1="12" x2="26" y2="12" stroke="#b08d57" strokeWidth="1" />
              <circle cx="36" cy="12" r="4" fill="none" stroke="#b08d57" strokeWidth="1.5" />
              <line x1="46" y1="12" x2="72" y2="12" stroke="#b08d57" strokeWidth="1" />
            </svg>
            <span tw="text-sm tracking-[0.6em] text-[#a08658] uppercase">Autumn Tea Party</span>
          </div>

          <div tw="flex flex-col items-center gap-7 text-center">
            <h1 tw="m-0 text-8xl font-bold leading-tight text-[#3f3527]">
              秋日茶会
            </h1>
            <p tw="m-0 max-w-[640px] text-xl leading-loose text-[#7a6a4f]">
              一盏桂香乌龙，两段旧友闲谈
              <br />
              敬备茶点，恭候光临 🍂
            </p>
          </div>

          <div tw="flex flex-col items-center gap-3">
            <div tw="flex flex-col items-center gap-1.5">
              <span tw="text-2xl font-semibold text-[#3f3527]">九月廿八（周六）下午 2:00</span>
              <span tw="text-lg text-[#7a6a4f]">杭州 · 满觉陇路桂雨轩</span>
            </div>
            <div tw="mt-4 rounded-full bg-[#3f3527] px-10 py-3">
              <span tw="text-lg tracking-[0.2em] text-[#f6f1e7]">敬 请 赐 复</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const options = {
  width: 1080,
  height: 1080,
  format: "png",
  fonts: ["Noto Serif SC:600..900"],
};
