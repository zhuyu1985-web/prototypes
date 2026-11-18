"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { projectName } from "@/lib/data";
import { useApp } from "@/lib/store";
import { statusTone } from "@/components/bits";
import { Badge, DemoNote, Empty } from "@/components/ui";

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const { state } = useApp();
  const item = state.applications.find((row) => row.id === params.id);
  if (!item) return <Empty title="未找到申请" desc="请从申请列表进入。" />;
  return (
    <div>
      <Link href="/market/applications" className="text-[13px] text-muted">返回申请</Link>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="text-[24px] font-semibold text-navy">{item.title}</h1>
        <Badge tone={statusTone(item.status)}>{item.status}</Badge>
      </div>
      <p className="mt-3 text-[14px] leading-7">{item.reason}</p>
      <p className="mt-2 text-[13px] text-muted">{item.specName} × {item.qty} · {projectName(item.projectId)} · 申请人 {item.applicant}</p>
      {item.ticketNo ? <p className="mt-3 text-[14px]">交付工单 <Link className="text-brand" href={`/console/tickets/tk-${item.ticketNo.split("-").pop()}`}>{item.ticketNo}</Link></p> : null}
      {item.status === "待审批" ? <p className="mt-3 text-[13px] text-muted">请到控制台审批台，由部门管理员或平台管理员处理。</p> : null}
      <DemoNote />
    </div>
  );
}
