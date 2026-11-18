import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-6">
      <div className="max-w-md text-center">
        <h1 className="text-[22px] font-semibold text-navy">页面不存在</h1>
        <p className="mt-2 text-[13px] text-muted">请从控制台导航进入。示意环境没有这条路径。</p>
        <Link href="/console/overview" className="mt-4 inline-block text-[13px] text-brand">返回总览</Link>
      </div>
    </div>
  );
}
