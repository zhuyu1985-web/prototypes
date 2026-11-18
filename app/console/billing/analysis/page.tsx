"use client";

import { useState } from "react";
import Link from "next/link";
import { cloudName, costFacts, domainName, optimizations, projectName } from "@/lib/data";
import { cloudPalette, yuan, yuanShort } from "@/lib/format";
import { scopedFacts } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { RequireRole, ScopeHint } from "@/components/bits";
import { Donut, HBar } from "@/components/charts";
import { Card, DemoNote, PageHeader } from "@/components/ui";
import type { CostFact, DomainId } from "@/lib/types";

const dims = ["云平台", "部门", "项目", "资源类型", "计费模式"] as const;
type Dim = (typeof dims)[number];

function labelOf(dim: Dim, fact: CostFact): string {
  if (dim === "云平台") return cloudName(fact.cloudId);
  if (dim === "部门") return domainName(fact.domainId);
  if (dim === "项目") return projectName(fact.projectId);
  if (dim === "资源类型") return fact.resourceType;
  return fact.billingMode;
}

export default function AnalysisPage() {
  const { state } = useApp();
  const [dim, setDim] = useState<Dim>("部门");
  const [mode, setMode] = useState<"month" | "year">("month");
  const [focus, setFocus] = useState<DomainId | null>(null);
  const facts = scopedFacts(state, costFacts).filter((fact) => !focus || fact.domainId === focus);
  const activeDim: Dim = focus ? "项目" : dim;
  const map = new Map<string, { label: string; amount: number; domainId?: DomainId }>();
  facts.forEach((fact) => {
    const label = labelOf(activeDim, fact);
    const current = map.get(label) ?? { label, amount: 0, domainId: fact.domainId };
    current.amount += mode === "month" ? fact.amount : fact.yearAmount;
    map.set(label, current);
  });
  const rows = [...map.values()].sort((a, b) => b.amount - a.amount);
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const colors = rows.map((row, index) => ({ label: row.label, value: row.amount, color: cloudPalette[index % cloudPalette.length] }));
  const low = optimizations.filter((item) => item.kind === "低负载虚拟机" && (!focus || item.domainId === focus));
  return (
    <RequireRole allow={["platform_admin", "domain_admin", "finance"]}>
      <PageHeader title="多维费用分析" desc="按云平台、部门、项目、资源类型和计费模式查看。点击部门可下钻到项目。" extra={
        <button type="button" className="h-9 rounded-md border border-line px-3 text-[13px]" onClick={() => setMode(mode === "month" ? "year" : "month")}>{mode === "month" ? "看本年累计" : "看本月"}</button>
      } />
      <ScopeHint />
      <div className="mb-3 flex flex-wrap gap-2">
        {dims.map((item) => (
          <button key={item} type="button" onClick={() => { setDim(item); setFocus(null); }} className={`h-8 rounded-md border px-3 text-[12px] ${dim === item && !focus ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{item}</button>
        ))}
      </div>
      {focus ? (
        <div className="mb-3 flex items-center justify-between rounded-md border border-line bg-white px-3 py-2 text-[13px]">
          <span>已下钻：{domainName(focus)} · 按项目</span>
          <button type="button" className="text-brand" onClick={() => setFocus(null)}>返回部门</button>
        </div>
      ) : null}
      <div className="grid grid-cols-[1fr_1fr] gap-4">
        <Card>
          <div className="text-[12px] text-muted">合计</div>
          <div className="num mt-1 text-[28px] font-semibold text-navy">{yuanShort(total)}</div>
          <div className="mt-4"><Donut items={colors} /></div>
        </Card>
        <Card>
          <HBar items={colors} />
          <table className="mt-4 w-full text-left text-[13px]">
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <td className="py-2">
                    {dim === "部门" && !focus ? (
                      <button type="button" data-testid={`drill-${row.domainId}`} className="text-navy underline decoration-line underline-offset-2" onClick={() => row.domainId && setFocus(row.domainId)}>{row.label}</button>
                    ) : row.label}
                  </td>
                  <td className="num text-right">{yuan(row.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      {low.length > 0 ? (
        <Card className="mt-4">
          <h2 className="text-[15px] font-semibold text-navy">关联优化建议</h2>
          <ul className="mt-2 space-y-2 text-[13px]">
            {low.map((item) => (
              <li key={item.id}><Link data-testid={item.id} href={`/console/billing/optimize/${item.id}`} className="text-brand">{item.title}</Link><span className="text-muted"> · 预计月省 {yuan(item.saving)}</span></li>
            ))}
          </ul>
        </Card>
      ) : null}
      <DemoNote />
    </RequireRole>
  );
}
