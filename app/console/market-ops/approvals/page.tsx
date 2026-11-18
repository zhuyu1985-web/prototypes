"use client";

import Link from "next/link";
import { projectName } from "@/lib/data";
import { roleMeta } from "@/lib/nav";
import { useApp } from "@/lib/store";
import { RequireRole, statusTone } from "@/components/bits";
import { Badge, Button, Card, DemoNote, PageHeader } from "@/components/ui";

export default function ApprovalsPage() {
  const { state, approve, reject } = useApp();
  const canAct = state.role === "platform_admin" || state.role === "domain_admin";
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="审批台" desc="一条历史申请因超配额被拦截；配额通过的申请可由部门管理员或平台管理员通过。通过后只生成主机申请工单，不自动开通。" />
      <p className="mb-3 text-[13px] text-muted">当前身份 {roleMeta[state.role].person} · {roleMeta[state.role].label}。切换为域管理员可按部门管理员口径审批。</p>
      <div className="space-y-3">
        {state.applications.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2"><span className="font-medium text-navy">{item.id}</span><Badge tone={statusTone(item.status)}>{item.status}</Badge>{item.session ? <Badge tone="info">本会话</Badge> : null}</div>
                <h2 className="mt-1 text-[16px] text-navy">{item.title}</h2>
                <p className="mt-1 text-[13px] text-muted">{item.specName} × {item.qty} · {item.cycle} · {projectName(item.projectId)} · {item.applicant}</p>
                <p className="mt-2 text-[13px] leading-6">{item.reason}</p>
                {item.ticketNo ? <p className="mt-2 text-[13px]">工单 <Link className="text-brand" href={`/console/tickets/tk-${item.ticketNo.split("-").pop()}`}>{item.ticketNo}</Link></p> : null}
              </div>
              {item.status === "待审批" && canAct ? (
                <div className="flex shrink-0 gap-2">
                  <Button data-testid={`approve-${item.id}`} onClick={() => approve(item.id)}>通过</Button>
                  <Button tone="ghost" onClick={() => reject(item.id)}>驳回</Button>
                </div>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
      <DemoNote>超配额示例为 APP-2026-1094。正常通过的申请会生成 TK 开头的主机申请工单。</DemoNote>
    </RequireRole>
  );
}
