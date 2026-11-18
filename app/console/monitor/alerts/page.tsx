"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { alerts } from "@/lib/data";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScopeHint, statusTone } from "@/components/bits";
import { Badge, DataTable, DemoNote, PageHeader } from "@/components/ui";
import type { AlertItem } from "@/lib/types";

export default function AlertsPage() {
  const { state } = useApp();
  const router = useRouter();
  const [status, setStatus] = useState<"未恢复" | "已恢复" | "全部">("未恢复");
  const rows = alerts.filter((item) => inScope(state, item.domainId, item.projectId) && (status === "全部" || item.status === status));
  return (
    <div>
      <PageHeader title="告警中心" desc="未恢复告警优先。历史告警保留以便对照。" />
      <ScopeHint />
      <div className="mb-3 flex gap-2">
        {(["未恢复", "已恢复", "全部"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setStatus(item)} className={`h-8 rounded-md border px-3 text-[12px] ${status === item ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{item}</button>
        ))}
      </div>
      <DataTable<AlertItem>
        rows={rows}
        onRow={(row) => router.push(`/console/monitor/alerts/${row.id}`)}
        rowTestId={(row) => `alert-${row.id}`}
        columns={[
          { key: "level", title: "级别", render: (row) => <Badge tone={statusTone(row.level)}>{row.level}</Badge> },
          { key: "title", title: "告警", render: (row) => row.title },
          { key: "policy", title: "策略", render: (row) => row.policy },
          { key: "status", title: "状态", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
          { key: "time", title: "时间", render: (row) => row.time },
        ]}
      />
      <DemoNote />
    </div>
  );
}
