"use client";

import { projectName } from "@/lib/data";
import { pct, tokens } from "@/lib/format";
import { useApp } from "@/lib/store";
import { RequireRole } from "@/components/bits";
import { Card, DemoNote, PageHeader } from "@/components/ui";

export default function AiQuotaPage() {
  const { state } = useApp();
  const rows = state.keys;
  return (
    <RequireRole allow={["platform_admin", "domain_admin", "project_owner"]}>
      <PageHeader title="配额与限流" desc="按虚拟 Key 控制月 token 配额和 QPS。超额后网关限流并记入审计，不静默失败。" />
      <div className="space-y-3">
        {rows.map((key) => {
          const rate = key.tokenQuota ? (key.usedTokens / key.tokenQuota) * 100 : 0;
          return (
            <Card key={key.id}>
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-medium text-navy">{key.name}</span>
                <span className="text-muted">{projectName(key.projectId)} · QPS {key.qps}</span>
              </div>
              <div className="mt-2 text-[12px] text-muted">{tokens(key.usedTokens)} / {tokens(key.tokenQuota)} · {pct(key.usedTokens, key.tokenQuota)}</div>
              <div className="mt-2 h-1.5 bg-[#EEF1F5]"><div className="h-1.5 bg-navy" style={{ width: `${Math.min(rate, 100)}%` }} /></div>
            </Card>
          );
        })}
      </div>
      <DemoNote />
    </RequireRole>
  );
}
