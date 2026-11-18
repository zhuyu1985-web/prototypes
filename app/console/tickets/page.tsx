"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { domainName } from "@/lib/data";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScopeHint, statusTone } from "@/components/bits";
import { Badge, Button, DataTable, DemoNote, PageHeader, fieldClass } from "@/components/ui";
import type { Ticket } from "@/lib/types";

export default function TicketsPage() {
  const { state } = useApp();
  const router = useRouter();
  const [box, setBox] = useState<"待办" | "已办" | "超时">("待办");
  const [type, setType] = useState("全部");
  const [dept, setDept] = useState("全部");
  const rows = useMemo(() => state.tickets.filter((ticket) => {
    if (!inScope(state, ticket.domainId, ticket.projectId)) return false;
    if (box === "已办" && ticket.status !== "已关闭") return false;
    if (box === "待办" && (ticket.status === "已关闭" || ticket.overdue)) return false;
    if (box === "超时" && !ticket.overdue && ticket.status !== "已超时") return false;
    if (type !== "全部" && ticket.type !== type) return false;
    if (dept !== "全部" && ticket.domainId !== dept) return false;
    return true;
  }), [state, box, type, dept]);
  const types = ["全部", ...new Set(state.tickets.map((ticket) => ticket.type))];
  return (
    <div>
      <PageHeader title="工单台账" desc="对内衔接集团 OA，对外跟踪云厂商工单。主机类单据在一期只登记，不执行开通。" extra={state.role === "finance" ? null : <Link href="/console/tickets/new"><Button>新建工单</Button></Link>} />
      <ScopeHint />
      <div className="mb-3 flex flex-wrap gap-2">
        {(["待办", "已办", "超时"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setBox(item)} className={`h-8 rounded-md border px-3 text-[12px] ${box === item ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{item}</button>
        ))}
        <select className={fieldClass} style={{ width: 160 }} value={type} onChange={(event) => setType(event.target.value)}>{types.map((item) => <option key={item}>{item}</option>)}</select>
        <select className={fieldClass} style={{ width: 160 }} value={dept} onChange={(event) => setDept(event.target.value)}>
          <option>全部</option>
          <option value="fusion">融媒云事业部</option>
          <option value="tech">技术中心</option>
          <option value="media">财经传媒</option>
          <option value="finance">财务共享中心</option>
        </select>
      </div>
      <DataTable<Ticket>
        rows={rows}
        onRow={(row) => router.push(`/console/tickets/${row.id}`)}
        rowTestId={(row) => `ticket-${row.id}`}
        columns={[
          { key: "no", title: "单号", render: (row) => <span className="num font-medium text-navy">{row.no}</span> },
          { key: "type", title: "类型", render: (row) => row.type },
          { key: "title", title: "标题", render: (row) => row.title },
          { key: "dept", title: "部门", render: (row) => domainName(row.domainId) },
          { key: "status", title: "状态", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
          { key: "time", title: "时间", render: (row) => row.createdAt },
        ]}
      />
      <DemoNote />
    </div>
  );
}
