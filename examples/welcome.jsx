export default function Welcome() {
  return (
    <div tw="flex h-full w-full flex-col justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-16">
      <div tw="flex flex-col gap-4">
        <span tw="text-sm font-medium uppercase tracking-[0.3em] text-[#38bdf8]">
          Snaply ✨
        </span>
        <h1 tw="m-0 text-6xl font-bold leading-tight text-white">
          用文字描述，<br />生成一张图片。
        </h1>
        <p tw="m-0 mt-4 max-w-[640px] text-xl text-slate-400">
          单文件 JSX 组件，本地渲染成 PNG / JPEG / WebP。
        </p>
      </div>
    </div>
  );
}

export const options = {
  width: 1200,
  height: 630,
  format: "png",
};
