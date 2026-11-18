"use client";

import Link from "next/link";
import { aiAllocations, aiModels, scenes } from "@/lib/data";
import { tokens } from "@/lib/format";
import { useApp } from "@/lib/store";
import { Card, DemoNote, PageHeader, PhaseTag, Stat } from "@/components/ui";

export default function AiHomePage() {
  const { state } = useApp();
  const input = aiAllocations.reduce((sum, item) => sum + item.input, 0);
  const output = aiAllocations.reduce((sum, item) => sum + item.output, 0);
  return (
    <div>
      <PageHeader title="AI 调度中心" desc="统一接入公有云大模型、视觉和语音。上层系统只持有虚拟 API Key，供应商密钥不出平台。" />
      <div className="grid grid-cols-4 gap-3">
        <Stat label="已接入模型" value={String(aiModels.length)} hint="LLM / 视觉 / 语音" />
        <Stat label="虚拟 API Key" value={String(state.keys.length)} hint="按项目限定范围" />
        <Stat label="本月输入 token" value={tokens(input)} hint="账期累计" />
        <Stat label="本月输出 token" value={tokens(output)} hint="按项目分摊" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {["模型目录", "虚拟 API Key", "调用审计"].map((label) => {
          const href = label === "模型目录" ? "/console/ai/models" : label === "虚拟 API Key" ? "/console/ai/keys" : "/console/ai/audit";
          return <Link key={label} href={href} className="rounded-lg border border-line bg-white p-4 hover:border-navy"><div className="text-[15px] font-medium text-navy">{label}</div><div className="mt-1 text-[12px] text-muted">进入{label}</div></Link>;
        })}
      </div>
      <h2 className="mb-3 mt-6 text-[16px] font-semibold text-navy">场景入口</h2>
      <div className="grid grid-cols-5 gap-3">
        {scenes.map((scene) => (
          <Link key={scene.id} href={`/console/ai/scenes/${scene.id}`} className="rounded-lg border border-line bg-white p-3 hover:border-navy">
            <div className="text-[11px] text-muted">{scene.kind}</div>
            <div className="mt-1 text-[14px] font-medium text-navy">{scene.name}</div>
            <p className="mt-2 text-[12px] leading-5 text-muted">{scene.summary}</p>
          </Link>
        ))}
      </div>
      <Card className="mt-4">
        <div className="flex items-center gap-2"><h2 className="text-[15px] font-semibold text-navy">私有化推理</h2><PhaseTag phase="三期开放" /></div>
        <p className="mt-2 text-[13px] text-muted">容器主机就绪后，才能把推理实例作为网关后端。一期路由只在已接入的公有云模型之间分配。</p>
      </Card>
      <DemoNote />
    </div>
  );
}
