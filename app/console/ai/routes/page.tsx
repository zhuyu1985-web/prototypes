"use client";

import { useState } from "react";
import { aiModels } from "@/lib/data";
import { useApp } from "@/lib/store";
import { RequireRole } from "@/components/bits";
import { Button, Card, DemoNote, PageHeader, fieldClass } from "@/components/ui";

export default function RoutesPage() {
  const { state, saveRoute } = useApp();
  const [drafts, setDrafts] = useState<Record<string, { modelId: string; weight: number }[]>>({});
  const [error, setError] = useState("");
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="路由规则" desc="按模型、标签或项目匹配。权重策略保存前要求合计为 100。保存只影响本会话。" />
      <div className="space-y-3">
        {state.routes.map((rule) => {
          const weights = drafts[rule.id] ?? rule.weights;
          return (
            <Card key={rule.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-navy">{rule.name}</h2>
                  <p className="mt-1 text-[12px] text-muted">{rule.match} · 策略 {rule.strategy}</p>
                </div>
                <Button tone="ghost" onClick={() => {
                  const total = weights.reduce((sum, item) => sum + Number(item.weight), 0);
                  if (rule.strategy === "权重" && total !== 100) {
                    setError(`${rule.name} 的权重之和为 ${total}，需要等于 100`);
                    return;
                  }
                  setError("");
                  saveRoute(rule.id, weights);
                  setDrafts((prev) => { const next = { ...prev }; delete next[rule.id]; return next; });
                }}>保存</Button>
              </div>
              <div className="mt-3 space-y-2">
                {weights.map((item, index) => (
                  <div key={item.modelId} className="flex items-center gap-3 text-[13px]">
                    <span className="w-40">{aiModels.find((model) => model.id === item.modelId)?.name ?? item.modelId}</span>
                    <input className={fieldClass} style={{ width: 100 }} type="number" value={item.weight} onChange={(event) => {
                      const next = weights.map((weight, weightIndex) => weightIndex === index ? { ...weight, weight: Number(event.target.value) } : weight);
                      setDrafts((prev) => ({ ...prev, [rule.id]: next }));
                    }} />
                    <span className="text-muted">权重</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
      {error ? <p className="mt-3 text-[13px] text-brand">{error}</p> : null}
      <DemoNote />
    </RequireRole>
  );
}
