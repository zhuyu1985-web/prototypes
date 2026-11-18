"use client";

import { anomalies, budgets } from "@/lib/data";
import { ratioPct, wave, yuan, yuanShort } from "@/lib/format";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { RequireRole, ScopeHint } from "@/components/bits";
import { LineChart } from "@/components/charts";
import { Badge, Card, DemoNote, PageHeader } from "@/components/ui";

export default function ForecastPage() {
  const { state } = useApp();
  const rows = budgets.filter((item) => item.level === "域" ? state.view === "admin" || item.refId === state.domainId : inScope(state, item.level === "项目" ? (item.refId.startsWith("fusion") ? "fusion" : item.refId.startsWith("tech") ? "tech" : item.refId.startsWith("media") ? "media" : "finance") : item.refId, item.level === "项目" ? item.refId : undefined));
  const visible = budgets.filter((item) => {
    const domainId = item.refId.startsWith("fusion") || item.refId === "fusion" ? "fusion" : item.refId.startsWith("tech") || item.refId === "tech" ? "tech" : item.refId.startsWith("media") || item.refId === "media" ? "media" : "finance";
    const projectId = item.level === "项目" ? item.refId : undefined;
    return inScope(state, domainId, projectId);
  });
  return (
    <RequireRole allow={["platform_admin", "domain_admin", "finance"]}>
      <PageHeader title="预算与预测" desc="预算阈值 80% 预警、100% 拦截包月申请。预测曲线按历史消费外推，只作规划参考。" />
      <ScopeHint />
      <Card>
        <h2 className="text-[15px] font-semibold text-navy">未来三个月费用预测</h2>
        <div className="mt-2 max-w-xl"><LineChart values={wave(3, 428, 18, 12)} /></div>
        <p className="mt-2 text-[12px] text-muted">横轴为近 9 个月与后 3 个月的示意外推，单位万元量级。{rows.length > 0 ? "" : ""}</p>
      </Card>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {visible.map((item) => {
          const rate = ratioPct(item.used, item.amount);
          const tone = rate >= 100 ? "danger" : rate >= 80 ? "warn" : "ok";
          return (
            <Card key={item.id}>
              <div className="flex items-center justify-between"><h3 className="text-[14px] font-medium text-navy">{item.level} · {item.name}</h3><Badge tone={tone}>{rate.toFixed(1)}%</Badge></div>
              <div className="mt-2 text-[12px] text-muted">{yuan(item.used)} / {yuan(item.amount)}</div>
              <div className="mt-2 h-1.5 bg-[#EEF1F5]"><div className="h-1.5" style={{ width: `${Math.min(rate, 100)}%`, background: rate >= 100 ? "#C8102E" : "#0B1F3A" }} /></div>
            </Card>
          );
        })}
      </div>
      <Card className="mt-4">
        <h2 className="text-[15px] font-semibold text-navy">异常消费</h2>
        <ul className="mt-3 space-y-3">
          {anomalies.filter((item) => inScope(state, item.domainId, item.projectId)).map((item) => (
            <li key={item.id}>
              <div className="text-[14px] text-navy">{item.title}<span className="ml-2 text-[12px] text-muted">{item.time}</span></div>
              <p className="mt-1 text-[13px] text-muted">{item.detail}</p>
            </li>
          ))}
        </ul>
      </Card>
      <p className="sr-only">{yuanShort(4286500)}</p>
      <DemoNote />
    </RequireRole>
  );
}
