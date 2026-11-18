"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cloudName, storages } from "@/lib/data";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScopeHint, statusTone } from "@/components/bits";
import { Badge, DataTable, DemoNote, PageHeader } from "@/components/ui";
import type { StorageItem, StorageKind } from "@/lib/types";

export default function StoragePage() {
  const { state } = useApp();
  const router = useRouter();
  const [kind, setKind] = useState<StorageKind | "全部">("全部");
  const rows = storages.filter((item) => inScope(state, item.domainId, item.projectId) && (kind === "全部" || item.kind === kind));
  return (
    <div>
      <PageHeader title="存储资源" desc="对象存储桶与云盘只读可见。上传、授权和挂载在二期开放。" />
      <ScopeHint />
      <div className="mb-3 flex gap-2">
        {(["全部", "对象存储", "云盘"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setKind(item)} className={`h-8 rounded-md border px-3 text-[12px] ${kind === item ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{item}</button>
        ))}
      </div>
      <DataTable<StorageItem>
        rows={rows}
        onRow={(row) => router.push(`/console/storage/${row.id}`)}
        columns={[
          { key: "name", title: "名称", render: (row) => <span className="font-medium text-navy">{row.name}</span> },
          { key: "kind", title: "类型", render: (row) => row.kind },
          { key: "cloud", title: "云平台", render: (row) => cloudName(row.cloudId) },
          { key: "size", title: "容量", render: (row) => row.size },
          { key: "tier", title: "层级 / 介质", render: (row) => row.tier },
          { key: "status", title: "状态", render: (row) => <span className="flex gap-2"><Badge tone={statusTone(row.status)}>{row.status}</Badge>{row.risk ? <Badge tone="danger">{row.risk}</Badge> : null}</span> },
        ]}
      />
      <DemoNote />
    </div>
  );
}
