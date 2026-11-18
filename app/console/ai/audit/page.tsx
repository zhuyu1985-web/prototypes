"use client";

import { aiAllocations, aiAudits, aiModels, projectName } from "@/lib/data";
import { tokens } from "@/lib/format";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScopeHint, statusTone } from "@/components/bits";
import { HBar } from "@/components/charts";
import { Badge, Card, DataTable, DemoNote, PageHeader } from "@/components/ui";
import type { AiAuditRow } from "@/lib/types";

export default function AiAuditPage() {
  const { state } = useApp();
  const allocations = aiAllocations.filter((item) => inScope(state, item.projectId === "media-site" ? "media" : item.projectId.startsWith("tech") ? "tech" : "fusion", item.projectId));
  const sessionKeys = state.keys.filter((key) => key.session);
  return (
    <div>
      <PageHeader title="调用审计" desc="最近调用是摘录，项目分摊是本账期累计。新签发的 Key 用量从下一笔调用开始归集。" />
      <ScopeHint />
      {sessionKeys.length > 0 ? (
        <Card className="mb-4">
          <div className="text-[13px] text-navy">本会话已签发 {sessionKeys.map((key) => `${key.mask}（${projectName(key.projectId)}）`).join("、")}。下图仍按项目汇总，新 Key 的 token 将计入对应项目。</div>
        </Card>
      ) : null}
      <div className="grid grid-cols-[0.9fr_1.1fr] gap-4">
        <Card>
          <h2 className="mb-3 text-[15px] font-semibold text-navy">按项目分摊 · 输入 token</h2>
          <HBar items={allocations.map((item) => ({ label: projectName(item.projectId), value: item.input }))} format={tokens} />
          <h2 className="mb-3 mt-5 text-[15px] font-semibold text-navy">输出 token</h2>
          <HBar items={allocations.map((item) => ({ label: projectName(item.projectId), value: item.output }))} format={tokens} />
        </Card>
        <Card>
          <h2 className="mb-3 text-[15px] font-semibold text-navy">账期累计</h2>
          <table className="w-full text-left text-[13px]">
            <thead className="text-[12px] text-muted"><tr><th className="py-1">项目</th><th>输入</th><th>输出</th></tr></thead>
            <tbody>
              {allocations.map((item) => (
                <tr key={item.projectId} className="border-t border-line">
                  <td className="py-2">{projectName(item.projectId)}</td>
                  <td className="num">{tokens(item.input)}</td>
                  <td className="num">{tokens(item.output)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <div className="mt-4">
        <DataTable<AiAuditRow>
          rows={aiAudits.filter((row) => inScope(state, row.projectId.startsWith("tech") ? "tech" : row.projectId === "media-site" ? "media" : "fusion", row.projectId))}
          columns={[
            { key: "time", title: "时间", render: (row) => row.time },
            { key: "project", title: "项目", render: (row) => projectName(row.projectId) },
            { key: "model", title: "模型", render: (row) => aiModels.find((model) => model.id === row.modelId)?.name ?? row.modelId },
            { key: "in", title: "输入", render: (row) => <span className="num">{row.inputTokens.toLocaleString("zh-CN")}</span> },
            { key: "out", title: "输出", render: (row) => <span className="num">{row.outputTokens.toLocaleString("zh-CN")}</span> },
            { key: "lat", title: "耗时", render: (row) => <span className="num">{row.latencyMs} ms</span> },
            { key: "status", title: "状态", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
          ]}
        />
      </div>
      <DemoNote />
    </div>
  );
}
