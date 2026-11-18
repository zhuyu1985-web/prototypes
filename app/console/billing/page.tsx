"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cloudName, projectName, vms } from "@/lib/data";
import { yuan } from "@/lib/format";
import { scopedFacts } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { RequireRole, ScopeHint } from "@/components/bits";
import { DataTable, DemoNote, Drawer, PageHeader } from "@/components/ui";

type BillRow = { id: string; name: string; kind: string; project: string; cloud: string; amount: number };

export default function BillingPage() {
  const { state } = useApp();
  const [tab, setTab] = useState<"项目级" | "资源级">("项目级");
  const [period, setPeriod] = useState("2026-11");
  const [open, setOpen] = useState<BillRow | null>(null);
  const facts = scopedFacts(state);
  const factor = period === "2026-10" ? 0.94 : 1;
  const projectRows = useMemo(() => {
    const map = new Map<string, BillRow>();
    facts.forEach((fact) => {
      const current = map.get(fact.projectId) ?? { id: fact.projectId, name: projectName(fact.projectId), kind: "项目汇总", project: projectName(fact.projectId), cloud: "多云", amount: 0 };
      current.amount += fact.amount * factor;
      map.set(fact.projectId, current);
    });
    return [...map.values()];
  }, [facts, factor]);
  const resourceRows: BillRow[] = vms.filter((vm) => facts.some((fact) => fact.projectId === vm.projectId)).slice(0, 8).map((vm) => ({
    id: vm.id,
    name: vm.name,
    kind: "虚拟机摘录",
    project: projectName(vm.projectId),
    cloud: cloudName(vm.cloudId),
    amount: Math.round((180 + vm.cpu * 62) * factor),
  }));
  const rows = tab === "项目级" ? projectRows : resourceRows;
  return (
    <RequireRole allow={["platform_admin", "domain_admin", "finance"]}>
      <PageHeader
        title="账单"
        desc="项目级汇总与费用分析同源。资源级是同步摘录，不要求单行相加等于项目合计。"
        extra={<Link href="/console/billing/analysis" className="text-[13px] text-brand">多维分析</Link>}
      />
      <ScopeHint />
      <div className="mb-3 flex gap-2">
        <select className="h-9 rounded-md border border-line px-2 text-[13px]" value={period} onChange={(event) => setPeriod(event.target.value)}>
          <option>2026-11</option>
          <option>2026-10</option>
        </select>
        {(["项目级", "资源级"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`h-9 rounded-md border px-3 text-[13px] ${tab === item ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{item}</button>
        ))}
      </div>
      <DataTable<BillRow>
        rows={rows}
        onRow={setOpen}
        columns={[
          { key: "name", title: "名称", render: (row) => <span className="font-medium text-navy">{row.name}</span> },
          { key: "kind", title: "层级", render: (row) => row.kind },
          { key: "project", title: "项目", render: (row) => row.project },
          { key: "cloud", title: "云平台", render: (row) => row.cloud },
          { key: "amount", title: "实付", render: (row) => <span className="num">{yuan(row.amount)}</span> },
        ]}
      />
      <Drawer open={Boolean(open)} title={open?.name ?? ""} onClose={() => setOpen(null)}>
        {open ? (
          <dl className="space-y-3 text-[13px]">
            <div className="flex justify-between"><dt className="text-muted">原价</dt><dd className="num">{yuan(open.amount / 0.92)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">优惠</dt><dd className="num">{yuan(open.amount / 0.92 - open.amount)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">实付</dt><dd className="num">{yuan(open.amount)}</dd></div>
            <p className="text-muted">账期 {period}。优惠按阿里云生产账号 92 折口径示意，其他云未单独折让。</p>
          </dl>
        ) : null}
      </Drawer>
      <p className="mt-3 text-[12px] text-muted">示意数据。资源级摘录不参与项目合计勾稽。</p>
      <DemoNote />
    </RequireRole>
  );
}
