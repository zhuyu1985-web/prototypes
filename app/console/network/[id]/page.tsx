"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cloudName, domainName, networks, projectName } from "@/lib/data";
import { statusTone } from "@/components/bits";
import { Badge, Card, DemoNote, Empty, PageHeader, PhaseButton } from "@/components/ui";

export default function NetworkDetailPage() {
  const params = useParams<{ id: string }>();
  const item = networks.find((row) => row.id === params.id);
  if (!item) return <Empty title="未找到网络资源" desc="请从网络台账重新进入。" />;
  return (
    <div>
      <PageHeader title={item.name} desc={`${item.kind} · ${cloudName(item.cloudId)} · ${domainName(item.domainId)} / ${projectName(item.projectId)}`} extra={<Link href="/console/network" className="text-[13px] text-muted">返回列表</Link>} />
      <div className="mb-4 flex gap-2">
        <PhaseButton phase="二期开放">{item.kind === "安全组" ? "变更规则" : item.kind === "EIP" ? "绑定 / 解绑" : "创建或变更"}</PhaseButton>
      </div>
      <Card>
        <div className="flex gap-2"><Badge tone={statusTone(item.status)}>{item.status}</Badge>{item.risk ? <Badge tone="danger">{item.risk}</Badge> : null}</div>
        <p className="mt-3 text-[14px]">{item.summary}</p>
        {item.cidr ? <p className="num mt-2 text-[13px] text-muted">{item.cidr}</p> : null}
        {item.rules ? (
          <table className="mt-4 w-full text-left text-[13px]">
            <thead className="text-[12px] text-muted"><tr><th className="py-1">方向</th><th>协议</th><th>端口</th><th>来源</th><th>动作</th></tr></thead>
            <tbody>
              {item.rules.map((rule) => (
                <tr key={`${rule.port}-${rule.source}`} className="border-t border-line">
                  <td className="py-2">{rule.dir}</td><td>{rule.proto}</td><td className="num">{rule.port}</td><td className="num">{rule.source}</td><td>{rule.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {item.risk ? <p className="mt-3 text-[13px] text-brand">该风险已进入安全检查。一期可以查看并登记整改工单，不能直接改规则。</p> : null}
      </Card>
      <DemoNote />
    </div>
  );
}
