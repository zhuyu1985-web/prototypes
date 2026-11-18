"use client";

import { useState } from "react";
import { products } from "@/lib/data";
import { useApp } from "@/lib/store";
import { RequireRole } from "@/components/bits";
import { Button, Card, DemoNote, Field, PageHeader, fieldClass } from "@/components/ui";
import type { ProductCategory } from "@/lib/types";

export default function MarketOpsPage() {
  const { state, publishProduct } = useApp();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("计算");
  const [price, setPrice] = useState(360);
  const [visibility, setVisibility] = useState("全集团可见");
  const list = [...state.productsExtra, ...products];
  return (
    <RequireRole allow={["platform_admin"]}>
      <PageHeader title="产品上架" desc="填写名称、分类、规格和可见范围。上架后出现在市场目录，价格走平台套餐口径。" />
      <div className="grid grid-cols-[320px_1fr] gap-4">
        <Card>
          <div className="space-y-3">
            <Field label="名称"><input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：突发计算型" /></Field>
            <Field label="分类">
              <select className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value as ProductCategory)}>
                {(["计算", "存储", "数据库", "中间件", "组合服务"] as ProductCategory[]).map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="规格月价"><input className={fieldClass} type="number" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></Field>
            <Field label="可见范围">
              <select className={fieldClass} value={visibility} onChange={(event) => setVisibility(event.target.value)}>
                <option>全集团可见</option>
                <option>融媒云事业部可见</option>
                <option>技术中心可见</option>
              </select>
            </Field>
            <Button disabled={!name.trim()} onClick={() => {
              publishProduct({
                id: `sku-${Date.now()}`,
                name: name.trim(),
                category,
                summary: "本会话上架的平台套餐。",
                detail: "审批与计量规则与目录内其他产品一致。",
                scene: "内部申请",
                visibility,
                specs: [{ id: "std", name: "标准规格", monthly: price, usage: "按量另计" }],
                session: true,
              });
              setName("");
            }}>上架</Button>
          </div>
        </Card>
        <Card>
          <table className="w-full text-left text-[13px]">
            <thead className="text-[12px] text-muted"><tr><th className="py-1">产品</th><th>分类</th><th>可见范围</th><th>起价</th></tr></thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-t border-line"><td className="py-2">{item.name}{item.session ? " · 本会话" : ""}</td><td>{item.category}</td><td>{item.visibility}</td><td className="num">¥{item.specs[0]?.monthly}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <DemoNote />
    </RequireRole>
  );
}
