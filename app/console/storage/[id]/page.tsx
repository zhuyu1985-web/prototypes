"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cloudName, domainName, projectName, storages } from "@/lib/data";
import { statusTone } from "@/components/bits";
import { Badge, Card, DemoNote, Empty, PageHeader, PhaseButton } from "@/components/ui";

export default function StorageDetailPage() {
  const params = useParams<{ id: string }>();
  const item = storages.find((row) => row.id === params.id);
  if (!item) return <Empty title="未找到存储资源" desc="请从存储台账重新进入。" />;
  return (
    <div>
      <PageHeader title={item.name} desc={`${item.kind} · ${cloudName(item.cloudId)} · ${domainName(item.domainId)} / ${projectName(item.projectId)}`} extra={<Link href="/console/storage" className="text-[13px] text-muted">返回列表</Link>} />
      <div className="mb-4"><PhaseButton phase="二期开放">{item.kind === "对象存储" ? "修改访问策略" : "挂载或释放"}</PhaseButton></div>
      <Card>
        <div className="flex gap-2"><Badge tone={statusTone(item.status)}>{item.status}</Badge>{item.risk ? <Badge tone="danger">{item.risk}</Badge> : null}</div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
          <div><dt className="text-muted">容量</dt><dd className="mt-1">{item.size}</dd></div>
          <div><dt className="text-muted">层级</dt><dd className="mt-1">{item.tier}</dd></div>
          <div><dt className="text-muted">访问</dt><dd className="mt-1">{item.acl ?? "—"}</dd></div>
          <div><dt className="text-muted">挂载</dt><dd className="mt-1">{item.attachedTo ?? "未挂载"}</dd></div>
        </dl>
        {item.acl === "公共读写" ? <p className="mt-4 text-[13px] text-brand">匿名读写已列入安全检查。一期不直接改 ACL。</p> : null}
      </Card>
      <DemoNote />
    </div>
  );
}
