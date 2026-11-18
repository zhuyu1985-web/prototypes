"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clouds, cloudName, domains } from "@/lib/data";
import { useApp } from "@/lib/store";
import { RequireRole } from "@/components/bits";
import { Button, Card, Field, PageHeader, fieldClass } from "@/components/ui";
import type { CloudId, DomainId } from "@/lib/types";

const steps = ["选择云平台", "凭据与连接", "同步区域", "账单采集", "同步任务"];

const regionMap: Record<CloudId, string[]> = {
  aliyun: ["华东1（杭州）", "华北2（北京）", "华南1（深圳）"],
  huawei: ["华东-上海一", "华北-北京四"],
  tencent: ["上海", "北京"],
  volc: ["华北2（北京）", "华东2（上海）"],
  cmcc: ["华东-苏州", "华北-北京"],
  ctyun: ["华东-杭州", "西南-成都"],
  "cmcc-ded": ["专属云-成都"],
  "ctyun-ded": ["专属云-上海"],
};

export default function ConnectAccountPage() {
  const { addAccount } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [cloudId, setCloudId] = useState<CloudId | "">("");
  const [ak, setAk] = useState("");
  const [sk, setSk] = useState("");
  const [tested, setTested] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [bill, setBill] = useState(true);
  const [domainId, setDomainId] = useState<DomainId>("fusion");
  const [cron, setCron] = useState("每 30 分钟");
  const [name, setName] = useState("");
  const [types, setTypes] = useState<string[]>(["计算", "网络", "存储", "数据库"]);

  function toggle(list: string[], value: string, set: (next: string[]) => void) {
    set(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  function testConnection() {
    if (!ak.trim() || !sk.trim()) {
      setTested(false);
      setTestMsg("请填写凭据后再测试。内容仅留在本页，不会写入台账。");
      return;
    }
    setTesting(true);
    window.setTimeout(() => {
      setTesting(false);
      setTested(true);
      setTestMsg("连接成功。凭据有效，权限为只读，可以继续选择区域。");
    }, 600);
  }

  function finish() {
    if (!cloudId) return;
    addAccount({
      name: name.trim() || `${cloudName(cloudId)}-融媒实验`,
      cloudId,
      domainId,
      regions,
      billCollect: bill ? "月账单 + 资源级流水" : "暂不采集",
      syncCron: `${cron} · ${types.join("、")}`,
    });
    setAk("");
    setSk("");
    router.push("/console/accounts");
  }

  const canNext = [
    Boolean(cloudId),
    tested,
    regions.length > 0,
    bill,
    Boolean(cron) && types.length > 0,
  ][step];

  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="接入云账号" desc="五步完成只读纳管。密钥不落库、不出现在列表和审计明细中。" />
      <ol className="mb-4 flex gap-2">
        {steps.map((label, index) => (
          <li key={label} className={`flex-1 border-t-2 pt-2 text-[12px] ${index <= step ? "border-navy text-navy" : "border-line text-muted"}`}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>
      <Card>
        {step === 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {clouds.map((cloud) => (
              <button
                key={cloud.id}
                type="button"
                data-testid={`wizard-cloud-${cloud.id}`}
                onClick={() => { setCloudId(cloud.id); setRegions([]); setTested(false); }}
                className={`rounded-md border px-3 py-4 text-left ${cloudId === cloud.id ? "border-navy bg-[#F4F7FB]" : "border-line"}`}
              >
                <div className="text-[14px] font-medium text-navy">{cloud.name}</div>
                <div className="mt-1 text-[12px] text-muted">{cloud.kind} · AccessKey 或管理凭据</div>
              </button>
            ))}
          </div>
        ) : null}
        {step === 1 ? (
          <div className="max-w-lg space-y-4">
            <Field label="AccessKey ID">
              <input data-testid="wizard-ak" className={fieldClass} type="password" autoComplete="off" value={ak} placeholder="请输入 AccessKey，仅作占位" onChange={(event) => { setAk(event.target.value); setTested(false); }} />
            </Field>
            <Field label="SecretKey">
              <input data-testid="wizard-sk" className={fieldClass} type="password" autoComplete="off" value={sk} placeholder="请输入 SecretKey，仅作占位" onChange={(event) => { setSk(event.target.value); setTested(false); }} />
            </Field>
            <Button type="button" data-testid="wizard-test" tone="ghost" onClick={testConnection} disabled={testing}>{testing ? "正在测试…" : "测试连接"}</Button>
            {testMsg ? <p className={`text-[13px] ${tested ? "text-ok" : "text-brand"}`} data-testid="wizard-test-result">{testMsg}</p> : null}
          </div>
        ) : null}
        {step === 2 && cloudId ? (
          <div className="space-y-2">
            {regionMap[cloudId].map((region) => (
              <label key={region} className="flex items-center gap-2 text-[14px]">
                <input type="checkbox" checked={regions.includes(region)} onChange={() => toggle(regions, region, setRegions)} />
                {region}
              </label>
            ))}
          </div>
        ) : null}
        {step === 3 ? (
          <div className="max-w-lg space-y-4">
            <label className="flex items-start gap-2 text-[14px]">
              <input type="checkbox" checked={bill} onChange={(event) => setBill(event.target.checked)} className="mt-1" />
              <span>采集月账单与资源级流水，并按账号优惠参与平台核算。优惠率沿用账号策略，不在这里填写密钥。</span>
            </label>
            <Field label="归属部门">
              <select className={fieldClass} value={domainId} onChange={(event) => setDomainId(event.target.value as DomainId)}>
                {domains.map((domain) => <option key={domain.id} value={domain.id}>{domain.name}</option>)}
              </select>
            </Field>
          </div>
        ) : null}
        {step === 4 && cloudId ? (
          <div className="max-w-lg space-y-4">
            <Field label="账号名称">
              <input className={fieldClass} value={name} placeholder={`${cloudName(cloudId)}-融媒实验`} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Field label="定时同步">
              <select className={fieldClass} value={cron} onChange={(event) => setCron(event.target.value)}>
                <option>每 30 分钟</option>
                <option>每 1 小时</option>
                <option>每天 02:10</option>
              </select>
            </Field>
            <div className="flex flex-wrap gap-3 text-[14px]">
              {["计算", "网络", "存储", "数据库"].map((item) => (
                <label key={item} className="flex items-center gap-1.5">
                  <input type="checkbox" checked={types.includes(item)} onChange={() => toggle(types, item, setTypes)} />{item}
                </label>
              ))}
            </div>
            <p className="text-[13px] leading-6 text-muted">将以只读方式同步 {cloudName(cloudId)} 的 {regions.join("、")}。接入后可在账号详情查看健康检查和任务状态。</p>
          </div>
        ) : null}
        <div className="mt-6 flex gap-2">
          {step > 0 ? <Button type="button" tone="ghost" onClick={() => setStep((value) => value - 1)}>上一步</Button> : null}
          {step < 4 ? (
            <Button type="button" data-testid="wizard-next" disabled={!canNext} onClick={() => setStep((value) => value + 1)}>下一步</Button>
          ) : (
            <Button type="button" data-testid="wizard-finish" tone="brand" disabled={!canNext} onClick={finish}>完成接入</Button>
          )}
        </div>
      </Card>
    </RequireRole>
  );
}
