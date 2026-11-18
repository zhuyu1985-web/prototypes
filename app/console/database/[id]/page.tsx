"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cloudName, databases, domainName, projectName } from "@/lib/data";
import { statusTone } from "@/components/bits";
import { Badge, Card, DemoNote, Empty, PageHeader, PhaseButton } from "@/components/ui";

export default function DatabaseDetailPage() {
  const params = useParams<{ id: string }>();
  const item = databases.find((row) => row.id === params.id);
  if (!item) return <Empty title="未找到实例" desc="请从数据库台账重新进入。" />;
  return (
    <div>
      <PageHeader title={item.name} desc={`${item.engine} · ${cloudName(item.cloudId)} · ${domainName(item.domainId)} / ${projectName(item.projectId)}`} extra={<Link href="/console/database" className="text-[13px] text-muted">返回列表</Link>} />
      <div className="mb-4 flex gap-2">
        <PhaseButton phase="二期开放">账号管理</PhaseButton>
        <PhaseButton phase="二期开放">备份</PhaseButton>
        <PhaseButton phase="二期开放">白名单</PhaseButton>
      </div>
      <Card>
        <Badge tone={statusTone(item.status)}>{item.status}</Badge>
        <dl className="mt-4 space-y-2 text-[13px]">
          <div className="flex justify-between"><dt className="text-muted">规格</dt><dd>{item.spec}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">内网地址</dt><dd className="num">{item.endpoint}</dd></div>
        </dl>
        {item.status === "空闲" ? <p className="mt-3 text-[13px] text-warn">近 14 日无连接，已进入成本优化建议。</p> : null}
      </Card>
      <DemoNote />
    </div>
  );
}
