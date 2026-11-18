"use client";

import { RequireRole, statusTone } from "@/components/bits";
import { Badge, Card, DemoNote, PageHeader } from "@/components/ui";

const rows = [
  ["统一认证适配", "正常", "OAuth 2.0 回调配置完整"],
  ["资源同步调度", "正常", "7 个账号按时完成，1 个延迟"],
  ["计量计费", "正常", "11 月账单已归集到项目"],
  ["AI 网关", "正常", "三套路由权重合计有效"],
  ["工单引擎", "正常", "OA 回传与厂商同步均有样例"],
  ["监控采集", "注意", "天翼云专属云同步延迟约 26 分钟"],
  ["消息通道", "注意", "Webhook 仍待验证"],
];

export default function InspectionPage() {
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="环境巡检" desc="2026-11-18 08:20 的平台组件巡检。这是报告页，不会对生产环境做探测。" />
      <Card>
        <table className="w-full text-left text-[14px]">
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-line">
                <td className="py-3 font-medium text-navy">{row[0]}</td>
                <td><Badge tone={row[1] === "正常" ? "ok" : statusTone("警告")}>{row[1]}</Badge></td>
                <td className="text-muted">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <DemoNote />
    </RequireRole>
  );
}
