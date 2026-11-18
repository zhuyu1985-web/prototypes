"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { RequireRole, ScopeHint } from "@/components/bits";
import { Badge, DataTable, DemoNote, PageHeader, fieldClass } from "@/components/ui";
import type { AuditEvent } from "@/lib/types";

export default function AuditPage() {
  const { state } = useApp();
  const [source, setSource] = useState("全部");
  const [q, setQ] = useState("");
  const rows = useMemo(() => state.audits.filter((item) => {
    if (source !== "全部" && item.source !== source) return false;
    if (q && !`${item.actor}${item.action}${item.target}`.includes(q.trim())) return false;
    return true;
  }), [state.audits, source, q]);
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="操作审计" desc="平台操作与云上同步日志可筛选。导出在正式环境提供，原型只展示留痕。" />
      <ScopeHint />
      <div className="mb-3 flex gap-2">
        <select className={fieldClass} style={{ width: 160 }} value={source} onChange={(event) => setSource(event.target.value)}>
          <option>全部</option><option>平台</option><option>云上同步</option>
        </select>
        <input className={fieldClass} style={{ width: 240 }} value={q} placeholder="操作人、动作或对象" onChange={(event) => setQ(event.target.value)} />
      </div>
      <DataTable<AuditEvent>
        rows={rows}
        columns={[
          { key: "time", title: "时间", render: (row) => row.time },
          { key: "actor", title: "操作人", render: (row) => `${row.actor} · ${row.role}` },
          { key: "action", title: "动作", render: (row) => row.action },
          { key: "target", title: "对象", render: (row) => row.target },
          { key: "source", title: "来源", render: (row) => row.source },
          { key: "result", title: "结果", render: (row) => <Badge tone={row.result === "成功" ? "ok" : "danger"}>{row.result}</Badge> },
        ]}
      />
      <DemoNote />
    </RequireRole>
  );
}
