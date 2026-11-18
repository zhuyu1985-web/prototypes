"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cloudName, networks } from "@/lib/data";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScopeHint, statusTone } from "@/components/bits";
import { Badge, DataTable, DemoNote, PageHeader } from "@/components/ui";
import type { NetItem, NetKind } from "@/lib/types";

const kinds: Array<NetKind | "全部"> = ["全部", "VPC", "子网", "安全组", "EIP", "NAT", "DNS", "负载均衡"];

export default function NetworkPage() {
  const { state } = useApp();
  const router = useRouter();
  const [kind, setKind] = useState<NetKind | "全部">("全部");
  const rows = networks.filter((item) => inScope(state, item.domainId, item.projectId) && (kind === "全部" || item.kind === kind));
  return (
    <div>
      <PageHeader title="网络资源" desc="VPC、安全组、弹性公网 IP、NAT、DNS 和负载均衡只读同步。规则变更二期开放。" />
      <ScopeHint />
      <div className="mb-3 flex flex-wrap gap-2">
        {kinds.map((item) => (
          <button key={item} type="button" onClick={() => setKind(item)} className={`h-8 rounded-md border px-3 text-[12px] ${kind === item ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{item}</button>
        ))}
      </div>
      <DataTable<NetItem>
        rows={rows}
        onRow={(row) => router.push(`/console/network/${row.id}`)}
        columns={[
          { key: "name", title: "名称", render: (row) => <span className="font-medium text-navy">{row.name}</span> },
          { key: "kind", title: "类型", render: (row) => row.kind },
          { key: "cloud", title: "云平台", render: (row) => cloudName(row.cloudId) },
          { key: "summary", title: "说明", render: (row) => row.summary },
          { key: "status", title: "状态", render: (row) => <span className="flex gap-2"><Badge tone={statusTone(row.status)}>{row.status}</Badge>{row.risk ? <Badge tone="danger">{row.risk}</Badge> : null}</span> },
        ]}
      />
      <DemoNote />
    </div>
  );
}
