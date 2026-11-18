"use client";

import { useState } from "react";
import { anomalies, budgets, clouds, costFacts, domainName, optimizations } from "@/lib/data";
import { cloudPalette, wave, yuan, yuanShort } from "@/lib/format";
import { scopedFacts } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScreenChrome } from "@/components/shell";
import { Donut, HBar, LineChart } from "@/components/charts";

export default function CostScreen() {
  const { state } = useApp();
  const [mode, setMode] = useState<"month" | "year">("month");
  const facts = scopedFacts(state);
  const total = facts.reduce((sum, fact) => sum + (mode === "month" ? fact.amount : fact.yearAmount), 0);
  const byCloud = clouds.map((cloud, index) => ({
    label: cloud.name,
    value: facts.filter((fact) => fact.cloudId === cloud.id).reduce((sum, fact) => sum + (mode === "month" ? fact.amount : fact.yearAmount), 0),
    color: cloudPalette[index % cloudPalette.length],
  })).filter((item) => item.value > 0);
  const byDomain = ["fusion", "tech", "media", "finance"].map((id) => ({
    label: domainName(id),
    value: facts.filter((fact) => fact.domainId === id).reduce((sum, fact) => sum + (mode === "month" ? fact.amount : fact.yearAmount), 0),
  })).filter((item) => item.value > 0);
  const byType = ["计算", "存储", "网络", "数据库", "AI 调用", "其他"].map((type) => ({
    label: type,
    value: costFacts.filter((fact) => fact.resourceType === type && facts.includes(fact)).reduce((sum, fact) => sum + fact.amount, 0),
  })).filter((item) => item.value > 0);
  const domainBudgets = budgets.filter((item) => item.level === "域");
  return (
    <ScreenChrome title="费用统计分析">
      <div className="mb-3 flex items-center gap-3 text-[13px]">
        <button type="button" className={mode === "month" ? "text-white" : "text-white/50"} onClick={() => setMode("month")}>本月</button>
        <button type="button" className={mode === "year" ? "text-white" : "text-white/50"} onClick={() => setMode("year")}>本年</button>
        <span className="text-white/40">人民币</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div className="border border-white/10 bg-white/5 px-4 py-3">
          <div className="text-[12px] text-white/55">{mode === "month" ? "本月消费" : "本年累计"}</div>
          <div className="num mt-1 text-[30px] font-semibold">{yuanShort(total)}</div>
          <div className="mt-1 text-[12px] text-white/50">环比 +6.4%</div>
        </div>
        <div className="col-span-3 border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">多云费用分布</div>
          <Donut dark items={byCloud} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">费用趋势</div>
          <LineChart dark color="#E7B3BE" values={wave(6, mode === "month" ? 14 : 120, mode === "month" ? 3 : 12)} />
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">部门分摊</div>
          <HBar dark items={byDomain} />
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">预算执行</div>
          {domainBudgets.map((item) => {
            const rate = (item.used / item.amount) * 100;
            return (
              <div key={item.id} className="mb-2">
                <div className="flex justify-between text-[12px] text-white/70"><span>{item.name}</span><span className={rate >= 80 ? "text-[#E7B3BE]" : ""}>{rate.toFixed(0)}%</span></div>
                <div className="mt-1 h-1.5 bg-white/10"><div className="h-1.5" style={{ width: `${Math.min(rate, 100)}%`, background: rate >= 100 ? "#C8102E" : "#D5E4F5" }} /></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-[13px]">
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-white/70">成本优化</div>
          <div className="num text-[22px]">{yuan(optimizations.reduce((sum, item) => sum + item.saving, 0))}</div>
          <div className="mt-1 text-white/50">每月可关注节省</div>
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-white/70">异常消费</div>
          {anomalies.map((item) => <p key={item.id} className="mb-1 text-white/80">{item.title}</p>)}
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-white/70">资源类型占比</div>
          <HBar dark items={byType} />
        </div>
      </div>
      <p className="mt-3 text-[11px] text-white/40">示意数据 · 口径与账单一致 · 大屏复用平台权限</p>
    </ScreenChrome>
  );
}
