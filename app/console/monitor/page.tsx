"use client";

import Link from "next/link";
import { alerts, databases, vms } from "@/lib/data";
import { wave } from "@/lib/format";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScopeHint, statusTone } from "@/components/bits";
import { LineChart } from "@/components/charts";
import { Badge, Card, DemoNote, PageHeader, Stat } from "@/components/ui";

export default function MonitorPage() {
  const { state } = useApp();
  const vmRows = vms.filter((item) => inScope(state, item.domainId, item.projectId));
  const open = alerts.filter((item) => item.status === "未恢复" && inScope(state, item.domainId, item.projectId));
  return (
    <div>
      <PageHeader title="监控总览" desc="跟随顶栏的管理后台、域和项目切换。自定义面板、告警和渠道在左侧菜单。" extra={<Link href="/console/monitor/panels" className="text-[13px] text-brand">自定义面板</Link>} />
      <ScopeHint />
      <div className="grid grid-cols-4 gap-3">
        <Stat label="虚拟机" value={String(vmRows.length)} />
        <Stat label="数据库与中间件" value={String(databases.filter((item) => inScope(state, item.domainId, item.projectId)).length)} />
        <Stat label="未恢复告警" value={String(open.length)} tone={open.length ? "danger" : "default"} />
        <Stat label="严重" value={String(open.filter((item) => item.level === "严重").length)} tone="danger" />
      </div>
      <Card className="mt-4">
        <h2 className="text-[15px] font-semibold text-navy">告警趋势（近 24 小时）</h2>
        <LineChart values={wave(8, 3, 1.4)} />
      </Card>
      <ul className="mt-4 space-y-2">
        {open.map((item) => (
          <li key={item.id}><Link href={`/console/monitor/alerts/${item.id}`} className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3 text-[13px]"><span className="flex items-center gap-2"><Badge tone={statusTone(item.level)}>{item.level}</Badge>{item.title}</span><span className="text-muted">{item.time}</span></Link></li>
        ))}
      </ul>
      <DemoNote />
    </div>
  );
}
