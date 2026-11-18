"use client";

import { channels } from "@/lib/data";
import { RequireRole, statusTone } from "@/components/bits";
import { Badge, Card, DemoNote, PageHeader } from "@/components/ui";

export default function ChannelsPage() {
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="通知渠道" desc="邮件、短信、钉钉、飞书、企业微信和 Webhook。接收人已按角色归组，不展示个人联系方式。" />
      <div className="grid grid-cols-2 gap-3">
        {channels.map((channel) => (
          <Card key={channel.id}>
            <div className="flex items-center justify-between"><h2 className="text-[15px] font-medium text-navy">{channel.name}</h2><Badge tone={statusTone(channel.status)}>{channel.status}</Badge></div>
            <p className="mt-2 text-[13px]">{channel.target}</p>
            <p className="mt-1 text-[12px] text-muted">{channel.usage}</p>
          </Card>
        ))}
      </div>
      <DemoNote />
    </RequireRole>
  );
}
