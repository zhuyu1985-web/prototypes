"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cloudName, domainName, projectName } from "@/lib/data";
import { useApp } from "@/lib/store";
import { statusTone } from "@/components/bits";
import { Badge, Button, Card, DemoNote, Empty, PageHeader, PhaseTag } from "@/components/ui";

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, addComment } = useApp();
  const [text, setText] = useState("");
  const ticket = state.tickets.find((item) => item.id === params.id);
  if (!ticket) return <Empty title="未找到工单" desc="请从工单台账重新进入。" />;
  return (
    <div>
      <PageHeader
        title={ticket.title}
        desc={`${ticket.no} · ${ticket.type} · ${domainName(ticket.domainId)} / ${projectName(ticket.projectId)}`}
        extra={<Link href="/console/tickets" className="text-[13px] text-muted">返回台账</Link>}
      />
      <div className="mb-3 flex items-center gap-2">
        <Badge tone={statusTone(ticket.status)}>{ticket.status}</Badge>
        {ticket.phaseNote ? <span className="inline-flex items-center gap-1 text-[12px] text-muted">自动化交付 <PhaseTag phase="二期开放" /></span> : null}
        <span className="text-[12px] text-muted">申请人 {ticket.applicant} · {ticket.createdAt}</span>
      </div>
      {ticket.phaseNote ? <p className="mb-3 text-[13px] text-brand">{ticket.content.includes("不在本平台自动开通") ? "一期不自动开通资源，由运营按既有渠道开通，并在本工单闭环。" : ticket.phaseNote}</p> : null}
      <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
        <div className="space-y-4">
          <Card>
            <h2 className="text-[15px] font-semibold text-navy">内容</h2>
            <p className="mt-2 text-[14px] leading-7">{ticket.content}</p>
          </Card>
          <Card>
            <h2 className="text-[15px] font-semibold text-navy">批注</h2>
            <ul className="mt-2 space-y-2 text-[13px]">
              {ticket.comments.map((comment, index) => <li key={index}><span className="text-navy">{comment.actor}</span> <span className="text-muted">{comment.time}</span><div>{comment.text}</div></li>)}
              {ticket.comments.length === 0 ? <li className="text-muted">还没有批注</li> : null}
            </ul>
            <textarea className="mt-3 h-20 w-full rounded-md border border-line p-2 text-[13px]" value={text} onChange={(event) => setText(event.target.value)} placeholder="补充处理说明" />
            <Button className="mt-2" tone="ghost" disabled={!text.trim()} onClick={() => { addComment(ticket.id, text.trim()); setText(""); }}>写入批注</Button>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <h2 className="text-[15px] font-semibold text-navy">流转</h2>
            <ol className="mt-3 space-y-3">
              {ticket.flow.map((node) => (
                <li key={node.name} className="border-l-2 border-navy pl-3">
                  <div className="text-[14px] text-navy">{node.name}</div>
                  <div className="text-[12px] text-muted">{node.result} · {node.actor} · {node.time}</div>
                </li>
              ))}
            </ol>
          </Card>
          {ticket.oa ? (
            <Card>
              <h2 className="text-[15px] font-semibold text-navy">集团 OA</h2>
              <p className="mt-2 text-[13px]">推送状态：{ticket.oa.pushed} · {ticket.oa.status}</p>
              {ticket.oa.opinion ? <p className="mt-2 text-[13px] leading-6">回传意见：{ticket.oa.opinion}</p> : null}
              <ul className="mt-3 space-y-2 text-[13px]">
                {ticket.oa.nodes.map((node) => <li key={node.name}>{node.name} · {node.result} · {node.actor}</li>)}
              </ul>
            </Card>
          ) : null}
          {ticket.vendor ? (
            <Card>
              <h2 className="text-[15px] font-semibold text-navy">云厂商工单</h2>
              <dl className="mt-2 space-y-1 text-[13px]">
                <div className="flex justify-between"><dt className="text-muted">云平台</dt><dd>{cloudName(ticket.vendor.cloudId)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">厂商单号</dt><dd className="num">{ticket.vendor.vendorNo}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">来源</dt><dd>{ticket.vendor.source}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">厂商状态</dt><dd>{ticket.vendor.vendorStatus}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">最近更新</dt><dd>{ticket.vendor.updatedAt}</dd></div>
              </dl>
            </Card>
          ) : null}
        </div>
      </div>
      <DemoNote />
    </div>
  );
}
