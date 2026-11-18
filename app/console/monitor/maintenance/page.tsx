"use client";

import { useApp } from "@/lib/store";
import { RequireRole } from "@/components/bits";
import { Card, DemoNote, PageHeader } from "@/components/ui";

export default function MaintenancePage() {
  const { state } = useApp();
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="维护屏蔽" desc="计划内变更窗口可以屏蔽指定策略。屏蔽记录只在本会话生效。" />
      <Card>
        <table className="w-full text-left text-[13px]">
          <thead className="text-[12px] text-muted"><tr><th className="py-1">窗口</th><th>范围</th><th>策略</th></tr></thead>
          <tbody>
            {state.silences.map((item) => (
              <tr key={item.id} className="border-t border-line"><td className="py-2">{item.window}</td><td>{item.scope}</td><td>{item.policy}</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
      <DemoNote />
    </RequireRole>
  );
}
