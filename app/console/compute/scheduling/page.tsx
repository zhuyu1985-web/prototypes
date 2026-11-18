"use client";

import Link from "next/link";
import { Card, DemoNote, PageHeader, PhaseTag } from "@/components/ui";

const levels = [
  ["必须", "只能落到指定标签的资源池"],
  ["尽量", "优先匹配，资源不足时可以回退"],
  ["避免", "尽量不放置，没有其他选择时才使用"],
  ["禁止", "不允许放置"],
];

export default function SchedulingPage() {
  return (
    <div>
      <PageHeader title="调度策略" desc="三期用于开通时的放置决策。一期不参与真实调度。" extra={<Link href="/console/compute" className="text-[13px] text-muted">返回计算资源</Link>} />
      <Card>
        <div className="flex items-center gap-2"><h2 className="text-[16px] font-semibold text-navy">标签与反亲和</h2><PhaseTag phase="三期开放" /></div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {levels.map(([name, desc]) => (
            <div key={name} className="border border-line p-3">
              <div className="text-[14px] font-medium text-navy">{name}</div>
              <p className="mt-1 text-[12px] leading-5 text-muted">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-muted">示例：融媒渲染与门户反亲和。策略可见，但不能保存或生效。</p>
        <button type="button" disabled className="mt-3 h-9 rounded-md border border-line px-3 text-[13px] text-muted">保存策略</button>
      </Card>
      <DemoNote />
    </div>
  );
}
