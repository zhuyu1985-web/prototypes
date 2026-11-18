"use client";

import Link from "next/link";
import { Card, DemoNote, PageHeader, PhaseTag } from "@/components/ui";

export default function ContainersPage() {
  return (
    <div>
      <PageHeader title="容器主机" desc="三期交付基于 containerd 的容器实例，用来承载私有化推理和应用。一期只保留入口。" extra={<Link href="/console/compute" className="text-[13px] text-muted">返回计算资源</Link>} />
      <Card>
        <div className="flex items-center gap-2"><h2 className="text-[16px] font-semibold text-navy">尚未开放</h2><PhaseTag phase="三期开放" /></div>
        <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted">容器主机不在一期纳管范围。公有云 AI 仍通过统一网关调用，私有化推理实例要等容器主机和调度策略一起上线。</p>
        <button type="button" disabled className="mt-4 h-9 rounded-md border border-line px-3 text-[13px] text-muted">创建容器主机</button>
      </Card>
      <DemoNote />
    </div>
  );
}
