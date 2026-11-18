"use client";

import Link from "next/link";
import { expiring, reports } from "@/lib/data";
import { projectName } from "@/lib/data";
import { useApp } from "@/lib/store";
import { RequireRole } from "@/components/bits";
import { Badge, Button, Card, DemoNote, PageHeader, PhaseTag } from "@/components/ui";

export default function ReportsPage() {
  const { state, addReport } = useApp();
  const docs = [...state.reportsExtra, ...reports];
  return (
    <RequireRole allow={["platform_admin", "domain_admin", "finance"]}>
      <PageHeader title="运营报表" desc="月报、日报和临期资源可以点开。自助续期二期开放，一期只做提醒。" extra={<Button tone="ghost" onClick={addReport}>按日报模板生成</Button>} />
      <div className="grid grid-cols-3 gap-3">
        {docs.map((doc) => (
          <Link key={doc.id} href={`/console/reports/${doc.id}`} className="rounded-lg border border-line bg-white p-4 hover:border-navy">
            <Badge>{doc.kind}</Badge>
            <div className="mt-2 text-[15px] font-medium text-navy">{doc.name}</div>
            <div className="mt-1 text-[12px] text-muted">{doc.period} · {doc.status}</div>
          </Link>
        ))}
      </div>
      <Card className="mt-4">
        <div className="flex items-center gap-2"><h2 className="text-[15px] font-semibold text-navy">临期资源</h2><PhaseTag phase="二期开放" /></div>
        <p className="mt-1 text-[12px] text-muted">续期按钮二期才执行，现在只跟踪到期日。</p>
        <table className="mt-3 w-full text-left text-[13px]">
          <tbody>
            {expiring.map((item) => (
              <tr key={item.name} className="border-t border-line">
                <td className="py-2">{item.name}</td>
                <td>{item.kind}</td>
                <td>{projectName(item.projectId)}</td>
                <td className="num">{item.due}</td>
                <td>剩余 {item.days} 天</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <DemoNote />
    </RequireRole>
  );
}
