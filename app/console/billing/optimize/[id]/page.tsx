"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { optimizations, projectName } from "@/lib/data";
import { yuan } from "@/lib/format";
import { useApp } from "@/lib/store";
import { Badge, Button, Card, DemoNote, Empty, PageHeader, PhaseButton } from "@/components/ui";

export default function OptimizeDetailPage() {
  const params = useParams<{ id: string }>();
  const { ignoreOpt, state } = useApp();
  const item = optimizations.find((row) => row.id === params.id);
  if (!item) return <Empty title="未找到建议" desc="该建议不在当前清单中。" />;
  const ignored = state.ignoredOpts.includes(item.id);
  return (
    <div>
      <PageHeader title={item.title} desc={`${item.kind} · ${projectName(item.projectId)}`} extra={<Link href="/console/billing/optimize" className="text-[13px] text-muted">返回列表</Link>} />
      <Card>
        <Badge tone="warn">{item.kind}</Badge>
        <p className="mt-3 text-[14px] leading-7">{item.detail}</p>
        <p className="mt-3 text-[14px] leading-7 text-navy">{item.suggestion}</p>
        <p className="num mt-4 text-[22px] font-semibold text-navy">预计月省 {yuan(item.saving)}</p>
        <div className="mt-4 flex gap-2">
          <Link href={item.href}><Button tone="ghost">查看资源</Button></Link>
          <PhaseButton phase="二期开放">一键处理</PhaseButton>
          <Button tone="ghost" disabled={ignored} onClick={() => ignoreOpt(item.id)}>{ignored ? "已忽略" : "忽略"}</Button>
        </div>
      </Card>
      <DemoNote />
    </div>
  );
}
