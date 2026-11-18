"use client";

import { useState } from "react";
import { domains, members, presetRoles, projects, quotas } from "@/lib/data";
import { pct } from "@/lib/format";
import { RequireRole, ScopeHint } from "@/components/bits";
import { Card, DemoNote, PageHeader } from "@/components/ui";
import type { QuotaRow } from "@/lib/types";

function QuotaBar({ label, pair }: { label: string; pair: [number, number] }) {
  const rate = (pair[0] / pair[1]) * 100;
  return (
    <div>
      <div className="mb-1 flex justify-between text-[12px]"><span>{label}</span><span className="num">{pair[0]} / {pair[1]} · {pct(pair[0], pair[1])}</span></div>
      <div className="h-1.5 bg-[#EEF1F5]"><div className="h-1.5" style={{ width: `${Math.min(rate, 100)}%`, background: rate >= 90 ? "#C8102E" : "#0B1F3A" }} /></div>
    </div>
  );
}

export default function OrgPage() {
  const [tab, setTab] = useState<"组织" | "角色" | "配额" | "开放集成">("组织");
  return (
    <RequireRole allow={["platform_admin", "domain_admin", "project_owner"]}>
      <PageHeader title="组织与权限" desc="集团下设四个部门。融媒云事业部包含融媒云平台与内容生产中台。预置 17 个角色，含运维、安全、审计三员。" />
      <ScopeHint />
      <div className="mb-4 flex gap-2">
        {(["组织", "角色", "配额", "开放集成"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`h-8 rounded-md border px-3 text-[13px] ${tab === item ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{item}</button>
        ))}
      </div>
      {tab === "组织" ? (
        <div className="grid grid-cols-[280px_1fr] gap-4">
          <Card>
            <div className="text-[14px] font-semibold text-navy">集团</div>
            <ul className="mt-3 space-y-3 text-[13px]">
              {domains.map((domain) => (
                <li key={domain.id}>
                  <div className="font-medium">{domain.name}</div>
                  <ul className="mt-1 space-y-1 pl-3 text-muted">
                    {projects.filter((project) => project.domainId === domain.id).map((project) => <li key={project.id}>{project.name}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-[15px] font-semibold text-navy">已同步成员</h2>
            <table className="mt-3 w-full text-left text-[13px]">
              <thead className="text-[12px] text-muted"><tr><th className="py-1">姓名</th><th>角色</th><th>组织</th><th>来源</th></tr></thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.name} className="border-t border-line"><td className="py-2">{member.name}</td><td>{member.role}</td><td>{member.org}</td><td>{member.source}</td></tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      ) : null}
      {tab === "角色" ? (
        <Card>
          <table className="w-full text-left text-[13px]">
            <thead className="text-[12px] text-muted"><tr><th className="py-1">角色</th><th>分组</th><th>说明</th></tr></thead>
            <tbody>
              {presetRoles.map((role) => (
                <tr key={role.name} className="border-t border-line"><td className="py-2 font-medium text-navy">{role.name}</td><td>{role.group}</td><td>{role.summary}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : null}
      {tab === "配额" ? (
        <div className="grid grid-cols-2 gap-3">
          {quotas.map((row) => <QuotaCard key={row.name} row={row} />)}
        </div>
      ) : null}
      {tab === "开放集成" ? (
        <div className="grid grid-cols-2 gap-3">
          <Card><h2 className="font-semibold text-navy">REST API</h2><p className="mt-2 text-[13px] leading-6 text-muted">平台能力以 REST 开放。原型不提供可调用的内网地址，避免被误认为生产入口。</p></Card>
          <Card><h2 className="font-semibold text-navy">SDK</h2><p className="mt-2 text-[13px] leading-6 text-muted">Java、Python、Go、Node.js 四套 SDK 与云命令行在底座规划中，一期文档可见、安装包不随原型分发。</p></Card>
          <Card><h2 className="font-semibold text-navy">Webhook</h2><p className="mt-2 text-[13px] leading-6 text-muted">告警可转发到集团监控总线。通道状态见通知渠道，当前 Webhook 待验证。</p></Card>
          <Card><h2 className="font-semibold text-navy">白标</h2><p className="mt-2 text-[13px] leading-6 text-muted">平台名称已设为每经云，登录页与术语使用集团口径。菜单显隐由角色和视图控制。</p></Card>
        </div>
      ) : null}
      <DemoNote />
    </RequireRole>
  );
}

function QuotaCard({ row }: { row: QuotaRow }) {
  return (
    <Card>
      <div className="text-[12px] text-muted">{row.scope}</div>
      <h3 className="text-[15px] font-semibold text-navy">{row.name}</h3>
      <div className="mt-3 space-y-2">
        <QuotaBar label="虚拟机" pair={row.vm} />
        <QuotaBar label="CPU 核" pair={row.cpu} />
        <QuotaBar label="内存 GB" pair={row.mem} />
        <QuotaBar label="磁盘 TB" pair={row.disk} />
        <QuotaBar label="EIP" pair={row.eip} />
        {row.ossTb ? <QuotaBar label="对象存储 TB" pair={row.ossTb} /> : null}
      </div>
    </Card>
  );
}
