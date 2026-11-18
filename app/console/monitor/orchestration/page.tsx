"use client";

import { Card, DemoNote, PageHeader, PhaseButton, PhaseTag } from "@/components/ui";

const charts = ["融媒门户栈", "Redis 主从", "日志采集"];

export default function OrchestrationPage() {
  return (
    <div>
      <PageHeader title="应用编排" desc="Helm 市场与一键部署按二期开放。这里只展示将要提供的入口，避免菜单断链。" />
      <div className="mb-3"><PhaseTag phase="二期开放" /></div>
      <div className="grid grid-cols-3 gap-3">
        {charts.map((name) => (
          <Card key={name}>
            <h2 className="text-[15px] font-medium text-navy">{name}</h2>
            <p className="mt-2 text-[13px] text-muted">编排模板可见。部署会调用云平台接口，一期不执行。</p>
            <div className="mt-3"><PhaseButton phase="二期开放">部署</PhaseButton></div>
          </Card>
        ))}
      </div>
      <DemoNote />
    </div>
  );
}
