"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cloudName, domainName, projectName, vmOperationLogs, vms } from "@/lib/data";
import { wave } from "@/lib/format";
import { statusTone } from "@/components/bits";
import { LineChart } from "@/components/charts";
import { Badge, Card, DemoNote, Empty, PageHeader, PhaseButton } from "@/components/ui";

export default function VmDetailPage() {
  const params = useParams<{ id: string }>();
  const vm = vms.find((item) => item.id === params.id);
  if (!vm) return <Empty title="未找到虚拟机" desc="请从计算资源台账重新进入。" />;
  const seed = vm.name.length * 3;
  const charts = [
    { label: "CPU %", values: wave(seed, vm.status === "运行中" ? vm.cpuAvg : 0, 8), color: "#0B1F3A" },
    { label: "内存 %", values: wave(seed + 2, vm.status === "运行中" ? vm.memAvg : 0, 6), color: "#1D4E89" },
    { label: "磁盘 %", values: wave(seed + 4, vm.id === "fin-app-02" ? 88 : 46, 4), color: "#8A5A00" },
    { label: "网络 Mbps", values: wave(seed + 6, vm.publicIp ? 42 : 8, 12), color: "#0F7B66" },
  ];
  return (
    <div>
      <PageHeader
        title={vm.name}
        desc={`${cloudName(vm.cloudId)} · ${vm.region} · ${domainName(vm.domainId)} / ${projectName(vm.projectId)}`}
        extra={<Link href="/console/compute" className="text-[13px] text-muted">返回台账</Link>}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <PhaseButton phase="二期开放">开机</PhaseButton>
        <PhaseButton phase="二期开放">关机</PhaseButton>
        <PhaseButton phase="二期开放">重启</PhaseButton>
        <PhaseButton phase="二期开放">VNC</PhaseButton>
        <PhaseButton phase="二期开放">Web Shell</PhaseButton>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <Card><div className="text-[12px] text-muted">状态</div><div className="mt-2"><Badge tone={statusTone(vm.status)}>{vm.status}</Badge></div></Card>
        <Card><div className="text-[12px] text-muted">规格</div><div className="mt-2 text-[15px]">{vm.cpu} 核 / {vm.memoryGb} GB / {vm.diskGb} GB</div></Card>
        <Card><div className="text-[12px] text-muted">地址</div><div className="num mt-2 text-[14px]">{vm.privateIp}{vm.publicIp ? ` · ${vm.publicIp}` : ""}</div></Card>
        <Card><div className="text-[12px] text-muted">系统</div><div className="mt-2 text-[14px]">{vm.os}</div></Card>
      </div>
      <Card className="mt-4">
        <h2 className="text-[15px] font-semibold text-navy">近 24 小时监控</h2>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {charts.map((chart) => (
            <div key={chart.label}>
              <div className="mb-1 text-[12px] text-muted">{chart.label}</div>
              <LineChart values={chart.values} color={chart.color} />
            </div>
          ))}
        </div>
      </Card>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card>
          <h2 className="text-[15px] font-semibold text-navy">标签与归属</h2>
          <div className="mt-3 flex flex-wrap gap-2">{vm.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
          <p className="mt-3 text-[13px] text-muted">创建于 {vm.createdAt}。归属按云上项目同步到平台项目「{projectName(vm.projectId)}」。</p>
          {vm.lowLoad ? <p className="mt-2 text-[13px] text-warn">该实例被识别为低负载，可在成本优化中查看建议。</p> : null}
        </Card>
        <Card>
          <h2 className="text-[15px] font-semibold text-navy">操作审计</h2>
          <ul className="mt-3 space-y-2 text-[13px]">
            {vmOperationLogs.map((log) => (
              <li key={log.time} className="flex justify-between gap-3"><span>{log.time} · {log.action}</span><span className="text-muted">{log.result}</span></li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-muted">一期只同步云上日志，不从本平台下发变更。</p>
        </Card>
      </div>
      <DemoNote />
    </div>
  );
}
