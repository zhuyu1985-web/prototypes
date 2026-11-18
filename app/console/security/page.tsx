"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { findings } from "@/lib/data";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { RequireRole, ScopeHint } from "@/components/bits";
import { Badge, Button, Card, DemoNote, PageHeader, PhaseButton } from "@/components/ui";

export default function SecurityPage() {
  const { state, rectify } = useApp();
  const router = useRouter();
  const rows = findings.filter((item) => inScope(state, item.domainId, item.projectId));
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="安全检查" desc="周期扫描安全组全开放和对象存储公共读写。一期可查看并登记工单，一键修复二期开放。" />
      <ScopeHint />
      <div className="space-y-3">
        {rows.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2"><Badge tone="danger">{item.level}</Badge><span className="text-[12px] text-muted">{item.kind}</span></div>
                <h2 className="mt-2 text-[16px] font-semibold text-navy">{item.title}</h2>
                <p className="mt-2 max-w-3xl text-[13px] leading-6 text-muted">{item.advice}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <Link href={item.href}><Button tone="ghost">查看资源</Button></Link>
                <Button tone="ghost" onClick={() => { const ticket = rectify(item.title, item.projectId); if (ticket?.id) router.push(`/console/tickets/${ticket.id}`); }}>登记整改工单</Button>
                <PhaseButton phase="二期开放">一键处理</PhaseButton>
              </div>
            </div>
          </Card>
        ))}
        {rows.length === 0 ? <Card><p className="text-[13px] text-muted">当前范围没有未处理的配置风险。</p></Card> : null}
      </div>
      <DemoNote />
    </RequireRole>
  );
}
