"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { expiring, projectName, reports } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Card, DemoNote, Empty, PageHeader } from "@/components/ui";

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const { state } = useApp();
  const doc = [...state.reportsExtra, ...reports].find((item) => item.id === params.id);
  if (!doc) return <Empty title="未找到报表" desc="请从报表列表进入。" />;
  const monthly = doc.kind === "月报";
  return (
    <div>
      <PageHeader title={doc.name} desc={`${doc.kind} · ${doc.period} · ${doc.status}`} extra={<Link href="/console/reports" className="text-[13px] text-muted">返回列表</Link>} />
      <Card>
        {monthly ? (
          <article className="max-w-3xl space-y-4 text-[14px] leading-7">
            <p>2026 年 10 月集团云资源消费 ¥4,028,600，环比 +3.1%。8 个云环境保持纳管，未恢复告警月末为 3 条。</p>
            <p>费用最高的部门仍是融媒云事业部和技术中心。内容生产的对象存储按量开始抬升，已在 11 月预算中越过 100%。</p>
            <p>低负载虚拟机与闲置 EIP 在 10 月巡检中已经出现，建议 11 月月报继续跟踪，执行放到二期。</p>
            <p className="text-[12px] text-muted">本页是已生成月报的摘录，不回写 11 月实时台账。</p>
          </article>
        ) : doc.kind === "临期资源" ? (
          <ul className="space-y-2 text-[14px]">
            {expiring.map((item) => <li key={item.name}>{item.name} · {projectName(item.projectId)} · {item.due}</li>)}
          </ul>
        ) : (
          <p className="text-[14px] leading-7">日报汇总了资源同步、未恢复告警和当日消费波动。生成动作只写在本会话，不会发送邮件。</p>
        )}
      </Card>
      <DemoNote />
    </div>
  );
}
