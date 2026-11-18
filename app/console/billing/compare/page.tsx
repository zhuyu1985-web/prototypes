"use client";

import { cloudName, compareRows } from "@/lib/data";
import { RequireRole } from "@/components/bits";
import { Card, DemoNote, PageHeader } from "@/components/ui";

export default function ComparePage() {
  return (
    <RequireRole allow={["platform_admin", "domain_admin", "finance"]}>
      <PageHeader title="跨云比价" desc="比较本平台已接入云上的通用计算 4核8GB 包月套餐价。专属云走资源池核算，不与公有云单价并列竞争。" />
      <Card>
        <table className="w-full text-left text-[14px]">
          <thead className="text-[12px] text-muted"><tr><th className="py-2">云平台</th><th>计价</th><th>平台套餐价</th></tr></thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.cloudId} className="border-t border-line">
                <td className="py-3">{cloudName(row.cloudId)}</td>
                <td>{row.mode}</td>
                <td className="num">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <DemoNote>价格为本平台套餐口径，不是云厂商零售标价。</DemoNote>
    </RequireRole>
  );
}
