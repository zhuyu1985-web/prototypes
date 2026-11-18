"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { budgets, products, projects } from "@/lib/data";
import { ratioPct } from "@/lib/format";
import { useApp } from "@/lib/store";
import { Badge, Button, DemoNote, Empty, Field, fieldClass } from "@/components/ui";
import type { ProjectId } from "@/lib/types";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, addToCart } = useApp();
  const product = [...state.productsExtra, ...products].find((item) => item.id === params.id);
  const [specId, setSpecId] = useState(product?.specs[1]?.id ?? product?.specs[0]?.id ?? "");
  const [projectId, setProjectId] = useState<ProjectId>("fusion-platform");
  const [cycle, setCycle] = useState<"包月" | "按量">("包月");
  const [qty, setQty] = useState(1);
  const [months, setMonths] = useState(1);
  if (!product) return <Empty title="未找到产品" desc="请返回目录。" />;
  const spec = product.specs.find((item) => item.id === specId) ?? product.specs[0];
  const budget = budgets.find((item) => item.refId === projectId);
  const rate = budget ? ratioPct(budget.used, budget.amount) : 0;
  const warn = cycle === "包月" && rate >= 100;
  return (
    <div className="grid grid-cols-[1.2fr_0.8fr] gap-6">
      <div>
        <div className="text-[13px] text-muted">{product.category} · {product.visibility}</div>
        <h1 className="mt-1 text-[28px] font-semibold text-navy">{product.name}</h1>
        <p className="mt-3 text-[14px] leading-7 text-muted">{product.detail}</p>
        <p className="mt-2 text-[13px] text-muted">适用：{product.scene}</p>
        <h2 className="mb-2 mt-6 text-[15px] font-semibold text-navy">规格</h2>
        <div className="grid grid-cols-3 gap-2">
          {product.specs.map((item) => (
            <button key={item.id} type="button" data-testid={`spec-${item.id}`} onClick={() => setSpecId(item.id)} className={`rounded-md border p-3 text-left ${spec.id === item.id ? "border-navy bg-[#F4F7FB]" : "border-line bg-white"}`}>
              <div className="text-[14px] font-medium">{item.name}</div>
              <div className="num mt-2 text-[16px] text-navy">¥{item.monthly.toLocaleString("zh-CN")}</div>
              <div className="text-[12px] text-muted">{item.usage}</div>
            </button>
          ))}
        </div>
      </div>
      <aside className="h-fit rounded-lg border border-line bg-white p-5">
        <h2 className="text-[16px] font-semibold text-navy">配置申请</h2>
        <div className="mt-4 space-y-3">
          <Field label="归属项目">
            <select data-testid="project-select" className={fieldClass} value={projectId} onChange={(event) => setProjectId(event.target.value as ProjectId)}>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </Field>
          <Field label="计费">
            <select className={fieldClass} value={cycle} onChange={(event) => setCycle(event.target.value as "包月" | "按量")}>
              <option>包月</option>
              <option>按量</option>
            </select>
          </Field>
          {cycle === "包月" ? <Field label="月数"><input className={fieldClass} type="number" min={1} max={12} value={months} onChange={(event) => setMonths(Number(event.target.value))} /></Field> : null}
          <Field label="数量"><input className={fieldClass} type="number" min={1} value={qty} onChange={(event) => setQty(Number(event.target.value))} /></Field>
        </div>
        <div className="mt-4 text-[13px] leading-6">
          {warn ? <Badge tone="danger">该项目预算已达 100%，包月申请会被拦截</Badge> : <span className="text-muted">预算执行 {rate.toFixed(1)}%。未到 100% 时不拦截，提交时仍会校验配额。</span>}
        </div>
        <Button className="mt-4 w-full" tone="brand" data-testid="btn-add-cart" onClick={() => { addToCart({ productId: product.id, specId: spec.id, qty, cycle, months, projectId }); router.push("/market/cart"); }}>加入购物车</Button>
        <p className="mt-3 text-[12px] leading-5 text-muted">审批通过后由运营按既有渠道开通，并在工单闭环。自动化交付二期开放。</p>
      </aside>
      <DemoNote />
    </div>
  );
}
