"use client";

import { useApp } from "@/lib/store";
import { RequireRole } from "@/components/bits";
import { Badge, DemoNote, PageHeader } from "@/components/ui";

export default function PoliciesPage() {
  const { state, togglePolicy } = useApp();
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="告警策略" desc="13 类内置策略。开关只保存在本会话，不会下发到云平台。" />
      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-[#F7F8FA] text-[12px] text-muted"><tr><th className="px-3 py-2">策略</th><th>分类</th><th>条件</th><th>级别</th><th>启用</th></tr></thead>
          <tbody>
            {state.policies.map((policy) => (
              <tr key={policy.id} className="border-t border-line">
                <td className="px-3 py-2 font-medium text-navy">{policy.name}</td>
                <td>{policy.category}</td>
                <td>{policy.condition}</td>
                <td><Badge tone={policy.level === "严重" ? "danger" : policy.level === "警告" ? "warn" : "neutral"}>{policy.level}</Badge></td>
                <td><button type="button" className="text-[13px] text-brand" onClick={() => togglePolicy(policy.id)}>{policy.enabled ? "已启用" : "已停用"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DemoNote />
    </RequireRole>
  );
}
