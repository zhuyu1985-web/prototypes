"use client";

import Link from "next/link";
import { optimizations } from "@/lib/data";
import { yuan } from "@/lib/format";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScopeHint } from "@/components/bits";
import { Badge, DemoNote, PageHeader } from "@/components/ui";

export default function OptimizePage() {
  const { state } = useApp();
  const rows = optimizations.filter((item) => inScope(state, item.domainId, item.projectId) && !state.ignoredOpts.includes(item.id));
  const saving = rows.reduce((sum, item) => sum + item.saving, 0);
  return (
    <div>
      <PageHeader title="成本优化" desc={`当前可关注建议 ${rows.length} 条，预计每月 ${yuan(saving)}。一键处理二期开放。`} />
      <ScopeHint />
      <div className="space-y-3">
        {rows.map((item) => (
          <Link key={item.id} href={`/console/billing/optimize/${item.id}`} data-testid={item.id} className="block rounded-lg border border-line bg-white p-4 hover:border-navy">
            <div className="flex items-center justify-between"><span className="text-[15px] font-medium text-navy">{item.title}</span><Badge tone="warn">{item.kind}</Badge></div>
            <p className="mt-2 text-[13px] text-muted">{item.detail}</p>
            <p className="mt-2 text-[13px]">预计月省 <span className="num">{yuan(item.saving)}</span></p>
          </Link>
        ))}
      </div>
      <DemoNote />
    </div>
  );
}
