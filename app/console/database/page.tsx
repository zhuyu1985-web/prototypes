"use client";

import { useRouter } from "next/navigation";
import { cloudName, databases, projectName } from "@/lib/data";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScopeHint, statusTone } from "@/components/bits";
import { Badge, DataTable, DemoNote, PageHeader } from "@/components/ui";
import type { DbItem } from "@/lib/types";

export default function DatabasePage() {
  const { state } = useApp();
  const router = useRouter();
  const rows = databases.filter((item) => inScope(state, item.domainId, item.projectId));
  return (
    <div>
      <PageHeader title="数据库与中间件" desc="RDS、Redis、MongoDB、Kafka、Elasticsearch 统一只读。账号、备份和白名单二期开放。" />
      <ScopeHint />
      <DataTable<DbItem>
        rows={rows}
        onRow={(row) => router.push(`/console/database/${row.id}`)}
        columns={[
          { key: "name", title: "名称", render: (row) => <span className="font-medium text-navy">{row.name}</span> },
          { key: "engine", title: "引擎", render: (row) => row.engine },
          { key: "cloud", title: "云平台", render: (row) => cloudName(row.cloudId) },
          { key: "project", title: "项目", render: (row) => projectName(row.projectId) },
          { key: "spec", title: "规格", render: (row) => row.spec },
          { key: "status", title: "状态", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
        ]}
      />
      <DemoNote />
    </div>
  );
}
