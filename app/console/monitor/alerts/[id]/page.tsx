"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { alerts, channels } from "@/lib/data";
import { wave } from "@/lib/format";
import { useApp } from "@/lib/store";
import { statusTone } from "@/components/bits";
import { LineChart } from "@/components/charts";
import { Badge, Button, Card, DemoNote, Empty, PageHeader } from "@/components/ui";

export default function AlertDetailPage() {
  const params = useParams<{ id: string }>();
  const { silenceAlert } = useApp();
  const alert = alerts.find((item) => item.id === params.id);
  if (!alert) return <Empty title="未找到告警" desc="请从告警中心重新进入。" />;
  const used = channels.filter((channel) => alert.channels.includes(channel.name));
  return (
    <div>
      <PageHeader title={alert.title} desc={`${alert.id.toUpperCase()} · ${alert.policy} · ${alert.resource}`} extra={<Link href="/console/monitor/alerts" className="text-[13px] text-muted">返回告警</Link>} />
      <div className="mb-3 flex gap-2"><Badge tone={statusTone(alert.level)}>{alert.level}</Badge><Badge tone={statusTone(alert.status)}>{alert.status}</Badge></div>
      <div className="grid grid-cols-[1.1fr_0.9fr] gap-4">
        <Card>
          <h2 className="text-[15px] font-semibold text-navy">指标</h2>
          <LineChart values={wave(alert.id.length, alert.level === "严重" ? 86 : 42, 8)} color="#C8102E" />
          <p className="mt-3 text-[14px] leading-7">{alert.detail}</p>
          {alert.href ? <Link href={alert.href} className="mt-3 inline-block text-[13px] text-brand">查看关联资源</Link> : null}
        </Card>
        <Card>
          <h2 className="text-[15px] font-semibold text-navy">通知渠道</h2>
          <ul className="mt-3 space-y-3">
            {used.map((channel) => (
              <li key={channel.id} className="border-b border-line pb-2 text-[13px]">
                <div className="flex items-center justify-between"><span className="font-medium text-navy">{channel.name}</span><Badge tone={statusTone(channel.status)}>{channel.status}</Badge></div>
                <div className="mt-1 text-muted">{channel.target}</div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-muted">触发时间 {alert.time}。渠道管理见通知渠道页。</p>
          <Button className="mt-3" tone="ghost" onClick={() => silenceAlert(alert.policy)}>加入维护屏蔽</Button>
        </Card>
      </div>
      <DemoNote />
    </div>
  );
}
