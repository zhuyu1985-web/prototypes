"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { Button, Card, PageHeader } from "@/components/ui";

export default function MessagesPage() {
  const { state, markAllRead } = useApp();
  return (
    <div>
      <PageHeader title="消息中心" desc="站内信汇总告警、审批和余额。标记已读只影响本会话。" extra={<Button tone="ghost" onClick={markAllRead}>全部已读</Button>} />
      <div className="space-y-2">
        {state.messages.map((item) => (
          <Link key={item.id} href={item.href} className="block">
            <Card className={item.unread ? "border-navy" : ""}>
              <div className="flex items-center justify-between text-[14px]"><span className="font-medium text-navy">{item.title}</span><span className="text-[12px] text-muted">{item.unread ? "未读" : "已读"} · {item.time}</span></div>
              <p className="mt-1 text-[13px] text-muted">{item.body}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
