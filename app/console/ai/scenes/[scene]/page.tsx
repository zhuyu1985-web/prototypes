"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { alerts, optimizations, scenes, vms } from "@/lib/data";
import { yuan } from "@/lib/format";
import type { SceneId } from "@/lib/data";
import { Button, Card, DemoNote, Empty, PageHeader } from "@/components/ui";

function answerFor(scene: SceneId, prompt: string): string {
  const running = vms.filter((vm) => vm.projectId === "fusion-platform" && vm.status === "运行中").length;
  const stopped = vms.filter((vm) => vm.projectId === "fusion-platform" && vm.status === "已停止").length;
  switch (scene) {
    case "ops-qa":
      return `根据当前台账，融媒云平台运行中虚拟机 ${running} 台，已停止 ${stopped} 台。提问「${prompt.slice(0, 24)}」不会触发开关机。一期不能从这里下发变更，需要走工单或既有云控制台。`;
    case "alert-rca":
      return "ALT-1042：rm-web-01 CPU 连续高于 90%。同时段厂商工单 ALI-202611-88231 记录公网入向丢包。更像流量异常打满 CPU，而不是单纯规格不足。建议先对照负载均衡后端，再决定是否扩容。扩容本身二期才在本平台执行。";
    case "tag-ocr":
      return "识别结果：资产编号 rm-web-01；项目 融媒云平台；云平台 阿里云；机房标签 华东1。已生成台账草稿，未写入生产库。";
    case "voice-ops":
      return `已转写：「${prompt || "查询未恢复的严重告警"}」。当前严重且未恢复的告警有 ${alerts.filter((item) => item.level === "严重" && item.status === "未恢复").length} 条，优先看门户 CPU 和财务专区磁盘。`;
    case "cost-readout":
      return `本月可落地的优化约 ${yuan(optimizations.reduce((sum, item) => sum + item.saving, 0))}。优先处理内容生产的两台低负载虚拟机，其次是未挂载云盘和空闲缓存。建议写进月报，执行仍走二期或现有渠道。`;
    default: {
      const neverScene: never = scene;
      return neverScene;
    }
  }
}

export default function ScenePage() {
  const params = useParams<{ scene: string }>();
  const scene = scenes.find((item) => item.id === params.scene);
  const [prompt, setPrompt] = useState(scene?.id === "voice-ops" ? "查询未恢复的严重告警" : "融媒云平台现在有多少台虚拟机在运行？");
  const [output, setOutput] = useState("");
  const presets = useMemo(() => scene ? answerFor(scene.id, prompt) : "", [scene, prompt]);
  if (!scene) return <Empty title="没有这个场景" desc="请从场景列表进入。" />;
  return (
    <div>
      <PageHeader title={scene.name} desc={scene.summary} extra={<Link href="/console/ai/scenes" className="text-[13px] text-muted">全部场景</Link>} />
      <Card>
        {scene.id === "tag-ocr" ? (
          <div className="mb-4 border border-dashed border-line bg-[#F7F8FA] p-6 text-[14px] text-navy">
            资产标签：RM-WEB-01 / 融媒云平台 / 阿里云 / 华东1
          </div>
        ) : null}
        <textarea className="h-24 w-full rounded-md border border-line p-3 text-[13px]" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        <Button className="mt-3" onClick={() => setOutput(presets)}>{scene.id === "tag-ocr" ? "识别录入" : scene.id === "voice-ops" ? "转写并查询" : "生成说明"}</Button>
        {output ? <p className="mt-4 text-[14px] leading-7 text-navy">{output}</p> : null}
      </Card>
      <DemoNote>本地示意回应，未连接模型服务。</DemoNote>
    </div>
  );
}
