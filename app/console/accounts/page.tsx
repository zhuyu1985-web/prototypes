"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cloudName } from "@/lib/data";
import { yuan } from "@/lib/format";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { RequireRole, ScopeHint, statusTone } from "@/components/bits";
import { Badge, Button, DataTable, DemoNote, PageHeader } from "@/components/ui";
import type { CloudAccount } from "@/lib/types";

export default function AccountsPage() {
  const { state } = useApp();
  const router = useRouter();
  const rows = state.accounts.filter((item) => inScope(state, item.domainId));
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader
        title="云账号"
        desc="8 个云环境均已接入。新账号走五步向导，凭据只在表单中填写并立即丢弃，平台侧保持只读。"
        extra={<Link href="/console/accounts/connect"><Button data-testid="btn-connect-account">接入云账号</Button></Link>}
      />
      <ScopeHint />
      <DataTable<CloudAccount>
        rows={rows}
        onRow={(row) => router.push(`/console/accounts/${row.id}`)}
        columns={[
          { key: "name", title: "账号", render: (row) => <span className="font-medium text-navy">{row.name}{row.session ? " · 本会话" : ""}</span> },
          { key: "cloud", title: "云平台", render: (row) => cloudName(row.cloudId) },
          { key: "health", title: "健康", render: (row) => <Badge tone={statusTone(row.health)}>{row.health}</Badge> },
          { key: "sync", title: "最近同步", render: (row) => row.lastSync },
          { key: "balance", title: "余额", render: (row) => (
            <span className="flex items-center gap-2">
              {row.balance === null ? "资源池结算" : <span className="num">{yuan(row.balance)}</span>}
              {row.balance !== null && row.balanceThreshold !== null && row.balance < row.balanceThreshold ? <Badge tone="danger">余额告警</Badge> : null}
            </span>
          ) },
          { key: "cron", title: "同步任务", render: (row) => row.syncCron },
        ]}
      />
      <DemoNote />
    </RequireRole>
  );
}
