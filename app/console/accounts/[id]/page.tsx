"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cloudName, domainName } from "@/lib/data";
import { yuan } from "@/lib/format";
import { useApp } from "@/lib/store";
import { RequireRole, statusTone } from "@/components/bits";
import { Badge, Button, Card, DemoNote, Empty, PageHeader } from "@/components/ui";

export default function AccountDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, checkAccount } = useApp();
  const account = state.accounts.find((item) => item.id === params.id);
  if (!account) return <Empty title="未找到云账号" desc="该账号不在当前台账中。" />;
  const low = account.balance !== null && account.balanceThreshold !== null && account.balance < account.balanceThreshold;
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader
        title={account.name}
        desc={`${cloudName(account.cloudId)} · ${domainName(account.domainId)} · 接入模式 ${account.access}`}
        extra={<Link href="/console/accounts" className="text-[13px] text-muted">返回列表</Link>}
      />
      <div className="grid grid-cols-4 gap-3">
        <Card><div className="text-[12px] text-muted">健康</div><div className="mt-2"><Badge tone={statusTone(account.health)}>{account.health}</Badge></div></Card>
        <Card><div className="text-[12px] text-muted">最近同步</div><div className="mt-2 text-[15px] text-navy">{account.lastSync}</div></Card>
        <Card><div className="text-[12px] text-muted">余额</div><div className="num mt-2 text-[18px] text-navy">{account.balance === null ? "资源池结算" : yuan(account.balance)}</div>{low ? <div className="mt-2"><Badge tone="danger">低于阈值 {yuan(account.balanceThreshold ?? 0)}</Badge></div> : null}</Card>
        <Card><div className="text-[12px] text-muted">优惠</div><div className="mt-2 text-[14px] text-navy">{account.discountLabel}</div></Card>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card>
          <h2 className="text-[15px] font-semibold text-navy">同步任务</h2>
          <dl className="mt-3 space-y-2 text-[13px]">
            <div className="flex justify-between"><dt className="text-muted">周期</dt><dd>{account.syncCron}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">区域</dt><dd>{account.regions.join("、")}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">账单</dt><dd>{account.billCollect}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">状态</dt><dd>最近一次{account.health === "同步延迟" ? "延迟" : "成功"}</dd></div>
          </dl>
          <div className="mt-4"><Button type="button" tone="ghost" onClick={() => checkAccount(account.id)}>立即健康检查</Button></div>
        </Card>
        <Card>
          <h2 className="text-[15px] font-semibold text-navy">免密跳转与代理</h2>
          <p className="mt-2 text-[13px] leading-6 text-muted">跳转到云厂商控制台和 HTTP 代理属于操作能力，二期再开放。一期只在这里确认管理面是否可达。</p>
          <div className="mt-3"><Button type="button" disabled>免密登录云控制台</Button></div>
        </Card>
      </div>
      <DemoNote />
    </RequireRole>
  );
}
