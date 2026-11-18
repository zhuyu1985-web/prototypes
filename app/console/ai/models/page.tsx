"use client";

import { aiModels, cloudName } from "@/lib/data";
import { Badge, Card, DemoNote, PageHeader } from "@/components/ui";
import type { AiKind } from "@/lib/types";

const kinds: AiKind[] = ["LLM", "视觉", "语音"];

export default function ModelsPage() {
  return (
    <div>
      <PageHeader title="模型目录" desc="一期接入 6 家公有云上的大模型、文字识别和语音能力。调用走 OpenAI 兼容的统一入口，调用方不感知供应商。" />
      {kinds.map((kind) => (
        <section key={kind} className="mb-5">
          <h2 className="mb-2 text-[16px] font-semibold text-navy">{kind}</h2>
          <div className="grid grid-cols-2 gap-3">
            {aiModels.filter((model) => model.kind === kind).map((model) => (
              <Card key={model.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[15px] font-medium text-navy">{model.name}</div>
                    <div className="mt-1 text-[12px] text-muted">{cloudName(model.cloudId)} · {model.context} · 计价 {model.unit}</div>
                  </div>
                  <Badge tone={model.stream ? "ok" : "neutral"}>{model.stream ? "支持流式" : "同步返回"}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
      <DemoNote />
    </div>
  );
}
