"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clouds, cloudName, domainName, domains, projectName, projects, vms } from "@/lib/data";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScopeHint, statusTone } from "@/components/bits";
import { Badge, DataTable, DemoNote, PageHeader, PhaseButton, fieldClass } from "@/components/ui";
import type { CloudId, Vm, VmStatus } from "@/lib/types";

export default function ComputePage() {
  const { state } = useApp();
  const router = useRouter();
  const [cloudId, setCloudId] = useState<CloudId | "">("");
  const [domainId, setDomainId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState<VmStatus | "">("");
  const rows = useMemo(() => vms.filter((vm) => {
    if (!inScope(state, vm.domainId, vm.projectId)) return false;
    if (cloudId && vm.cloudId !== cloudId) return false;
    if (domainId && vm.domainId !== domainId) return false;
    if (projectId && vm.projectId !== projectId) return false;
    if (status && vm.status !== status) return false;
    return true;
  }), [state, cloudId, domainId, projectId, status]);

  return (
    <div>
      <PageHeader
        title="计算资源"
        desc="统一只读台账。创建、开关机、远程登录和容器主机按期开放，入口保留。"
        extra={<><PhaseButton phase="二期开放">创建虚拟机</PhaseButton><Link href="/console/compute/containers" className="text-[13px] text-navy">容器主机</Link><Link href="/console/compute/scheduling" className="text-[13px] text-navy">调度策略</Link></>}
      />
      <ScopeHint />
      <div className="mb-3 flex flex-wrap gap-2">
        <select className={fieldClass} style={{ width: 160 }} value={cloudId} onChange={(event) => setCloudId(event.target.value as CloudId | "")}><option value="">全部云平台</option>{clouds.map((cloud) => <option key={cloud.id} value={cloud.id}>{cloud.name}</option>)}</select>
        <select className={fieldClass} style={{ width: 160 }} value={domainId} onChange={(event) => setDomainId(event.target.value)}><option value="">全部部门</option>{domains.map((domain) => <option key={domain.id} value={domain.id}>{domain.name}</option>)}</select>
        <select className={fieldClass} style={{ width: 180 }} value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="">全部项目</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select>
        <select className={fieldClass} style={{ width: 140 }} value={status} onChange={(event) => setStatus(event.target.value as VmStatus | "")}><option value="">全部状态</option><option>运行中</option><option>已停止</option><option>同步异常</option></select>
      </div>
      <DataTable<Vm>
        rows={rows}
        onRow={(row) => router.push(`/console/compute/${row.id}`)}
        rowTestId={(row) => `vm-${row.id}`}
        columns={[
          { key: "name", title: "名称", render: (row) => <span className="font-medium text-navy">{row.name}</span> },
          { key: "cloud", title: "云平台", render: (row) => cloudName(row.cloudId) },
          { key: "org", title: "部门 / 项目", render: (row) => `${domainName(row.domainId)} / ${projectName(row.projectId)}` },
          { key: "spec", title: "规格", render: (row) => `${row.cpu}核${row.memoryGb}GB` },
          { key: "ip", title: "私网 IP", render: (row) => <span className="num">{row.privateIp}</span> },
          { key: "cpu", title: "CPU 均值", render: (row) => <span className="num">{row.cpuAvg}%</span> },
          { key: "status", title: "状态", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
        ]}
      />
      <DemoNote />
    </div>
  );
}
