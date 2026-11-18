"use client";

import { useState } from "react";
import { wave } from "@/lib/format";
import { LineChart } from "@/components/charts";
import { Button, Card, DemoNote, PageHeader } from "@/components/ui";

const presets = {
  "融媒云生产值班": [wave(2, 55, 12), wave(4, 48, 8), wave(6, 30, 10)],
  "集团容量水位": [wave(1, 62, 6), wave(3, 70, 5), wave(5, 40, 9)],
};

export default function PanelsPage() {
  const [name, setName] = useState<keyof typeof presets | "未命名面板">("融媒云生产值班");
  const [extra, setExtra] = useState(false);
  const values = name === "未命名面板" ? [wave(9, 20, 4)] : presets[name];
  return (
    <div>
      <PageHeader title="自定义面板" desc="已配置两块值班面板，可切换。新建只在本会话保留。" extra={<Button tone="ghost" onClick={() => { setExtra(true); setName("未命名面板"); }}>新建面板</Button>} />
      <div className="mb-3 flex gap-2">
        {(Object.keys(presets) as Array<keyof typeof presets>).map((item) => (
          <button key={item} type="button" onClick={() => setName(item)} className={`h-8 rounded-md border px-3 text-[12px] ${name === item ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{item}</button>
        ))}
        {extra ? <button type="button" onClick={() => setName("未命名面板")} className={`h-8 rounded-md border px-3 text-[12px] ${name === "未命名面板" ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>未命名面板</button> : null}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {values.map((series, index) => (
          <Card key={index}>
            <div className="text-[12px] text-muted">{["CPU", "内存", "出网"][index] ?? "新建图表"}</div>
            <LineChart values={series} />
          </Card>
        ))}
      </div>
      <DemoNote />
    </div>
  );
}
