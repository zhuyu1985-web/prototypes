"use client";

import Link from "next/link";
import { alerts, clouds, costFacts, databases, networks, storages, vms } from "@/lib/data";
import { cloudPalette, yuanShort } from "@/lib/format";
import { inScope, scopedFacts } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScopeHint } from "@/components/bits";
import { Donut, HBar } from "@/components/charts";
import { Badge, Card, DemoNote, PageHeader, Stat } from "@/components/ui";
import { statusTone } from "@/components/bits";

export default function OverviewPage() {
  const { state } = useApp();
  const accounts = state.accounts.filter((item) => inScope(state, item.domainId));
  const cloudCount = new Set(accounts.map((item) => item.cloudId)).size;
  const vmRows = vms.filter((item) => inScope(state, item.domainId, item.projectId));
  const facts = scopedFacts(state, costFacts);
  const month = facts.reduce((sum, fact) => sum + fact.amount, 0);
  const openAlerts = alerts.filter((item) => item.status === "未恢复" && inScope(state, item.domainId, item.projectId));
  const pending = state.applications.filter((item) => item.status === "待审批" && inScope(state, item.domainId, item.projectId));
  const byCloud = clouds.map((cloud, index) => ({
    label: cloud.name,
    value: facts.filter((fact) => fact.cloudId === cloud.id).reduce((sum, fact) => sum + fact.amount, 0),
    color: cloudPalette[index % cloudPalette.length],
  })).filter((item) => item.value > 0);

  return (
    <div>
      <PageHeader title="平台总览" desc="一期看清 8 个云环境的资源、费用、告警和待办。资源开通与变更仍走既有渠道。" />
      <ScopeHint />
      <div className="grid grid-cols-4 gap-3">
        <div data-testid="stat-clouds"><Stat label="已纳管云环境" value={String(cloudCount)} hint={`云账号 ${accounts.length} 个 · 6 家公有云 + 2 家专属云`} /></div>
        <div data-testid="stat-cost"><Stat label="本月费用" value={yuanShort(month)} hint="含资源、AI 调用与其他，口径与账单一致" /></div>
        <div data-testid="stat-alerts"><Stat label="未恢复告警" value={String(openAlerts.length)} hint="严重优先处理" tone={openAlerts.length ? "danger" : "default"} /></div>
        <div data-testid="stat-todos"><Stat label="待办申请" value={String(pending.length)} hint="市场申请等待审批" tone={pending.length ? "warn" : "default"} /></div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        <Stat label="虚拟机" value={String(vmRows.length)} hint={`运行中 ${vmRows.filter((item) => item.status === "运行中").length} · 已停止 ${vmRows.filter((item) => item.status === "已停止").length} · 同步异常 ${vmRows.filter((item) => item.status === "同步异常").length}`} />
        <Stat label="网络对象" value={String(networks.filter((item) => inScope(state, item.domainId, item.projectId)).length)} hint="VPC、安全组、EIP、负载均衡" />
        <Stat label="存储对象" value={String(storages.filter((item) => inScope(state, item.domainId, item.projectId)).length)} hint="对象存储与云盘" />
        <Stat label="数据库与中间件" value={String(databases.filter((item) => inScope(state, item.domainId, item.projectId)).length)} hint="RDS、Redis、Kafka、检索" />
      </div>
      <div className="mt-4 grid grid-cols-[1.3fr_0.7fr] gap-4">
        <Card>
          <h2 className="text-[15px] font-semibold text-navy">本月费用按云平台</h2>
          <div className="mt-4"><Donut items={byCloud} /></div>
          <div className="mt-4"><HBar items={byCloud} /></div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-navy">未恢复告警</h2>
            <Link href="/console/monitor/alerts" className="text-[12px] text-brand">告警中心</Link>
          </div>
          <ul className="mt-3 space-y-3">
            {openAlerts.slice(0, 4).map((alert) => (
              <li key={alert.id}>
                <Link href={`/console/monitor/alerts/${alert.id}`} className="block">
                  <div className="flex items-center gap-2"><Badge tone={statusTone(alert.level)}>{alert.level}</Badge><span className="text-[12px] text-muted">{alert.time}</span></div>
                  <div className="mt-1 text-[13px] text-navy">{alert.title}</div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-navy">待办申请</h2>
            <Link href="/console/market-ops/approvals" className="text-[12px] text-brand">审批台</Link>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {pending.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2 text-[13px]">
                <span>{item.id} · {item.title}</span>
                <Badge tone="warn">{item.status}</Badge>
              </li>
            ))}
            {pending.length === 0 ? <li className="py-3 text-[13px] text-muted">当前范围没有待审批申请</li> : null}
          </ul>
        </Card>
        <Card>
          <h2 className="text-[15px] font-semibold text-navy">云账号健康</h2>
          <ul className="mt-3 space-y-2 text-[13px]">
            {accounts.slice(0, 6).map((account) => (
              <li key={account.id} className="flex items-center justify-between gap-3">
                <Link href={`/console/accounts/${account.id}`} className="truncate text-navy">{account.name}</Link>
                <span className="flex items-center gap-2">
                  {account.balance !== null && account.balanceThreshold !== null && account.balance < account.balanceThreshold ? <Badge tone="danger">余额告警</Badge> : null}
                  <Badge tone={statusTone(account.health)}>{account.health}</Badge>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-muted">费用与多维分析、费用大屏使用同一套账期口径。</p>
        </Card>
      </div>
      <DemoNote />
    </div>
  );
}
