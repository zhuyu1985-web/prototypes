"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { RequireRole } from "@/components/bits";
import { Button, Card, DemoNote, PageHeader } from "@/components/ui";

export default function SafetyPage() {
  const { state, toggleSafety } = useApp();
  const [raw, setRaw] = useState("请根据手机号 13812346210 查询融媒云平台的值班联系人。");
  const [out, setOut] = useState("");
  function preview() {
    let text = raw;
    if (state.safety.maskPii) text = text.replace(/1\d{10}/g, "138****6210");
    if (state.safety.inputScan && /身份证|密钥|口令/.test(raw)) {
      setOut("已拦截：输入命中敏感策略，未送往模型。");
      return;
    }
    if (state.safety.outboundBlock) {
      setOut("出域拦截已打开。该请求不会离开平台。");
      return;
    }
    setOut(`将送往模型的文本：${text}`);
  }
  const items: { key: keyof typeof state.safety; label: string; desc: string }[] = [
    { key: "inputScan", label: "输入内容安全", desc: "命中敏感策略时拦截，不把原文送给模型。" },
    { key: "maskPii", label: "敏感信息脱敏", desc: "手机号等在出域前替换。" },
    { key: "outboundBlock", label: "禁止出域", desc: "仅保留在平台内，适合财务等敏感场景试运行。" },
  ];
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="内容安全" desc="开关立即作用于本会话的场景演示，不会改供应商侧配置。" />
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <Card key={item.key}>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-medium text-navy">{item.label}</h2>
              <button type="button" onClick={() => toggleSafety(item.key)} className={`h-6 w-11 rounded-full ${state.safety[item.key] ? "bg-navy" : "bg-[#D5DCE6]"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white ${state.safety[item.key] ? "ml-5" : "ml-0.5"}`} />
              </button>
            </div>
            <p className="mt-2 text-[12px] leading-5 text-muted">{item.desc}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <h2 className="text-[15px] font-semibold text-navy">试一笔</h2>
        <textarea className="mt-3 h-24 w-full rounded-md border border-line p-3 text-[13px]" value={raw} onChange={(event) => setRaw(event.target.value)} />
        <Button className="mt-3" tone="ghost" onClick={preview}>按当前策略预览</Button>
        {out ? <p className="mt-3 text-[13px] text-navy">{out}</p> : null}
      </Card>
      <DemoNote />
    </RequireRole>
  );
}
