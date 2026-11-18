"use client";

import { alerts, clouds, databases, networks, storages, vms } from "@/lib/data";
import { wave } from "@/lib/format";
import { inScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { ScreenChrome } from "@/components/shell";
import { Gauge, HBar, LineChart } from "@/components/charts";

export default function ResourceScreen() {
  const { state } = useApp();
  const accounts = state.accounts.filter((item) => inScope(state, item.domainId));
  const vmRows = vms.filter((item) => inScope(state, item.domainId, item.projectId));
  const open = alerts.filter((item) => item.status === "未恢复" && inScope(state, item.domainId, item.projectId));
  const cloudsInScope = clouds.filter((cloud) => accounts.some((account) => account.cloudId === cloud.id));
  const running = vmRows.filter((vm) => vm.status === "运行中");
  const cpu = running.reduce((sum, vm) => sum + vm.cpuAvg, 0) / Math.max(running.length, 1);
  const top = [...vmRows].sort((a, b) => b.cpuAvg - a.cpuAvg).slice(0, 5);
  return (
    <ScreenChrome title="资源使用情况">
      <div className="grid grid-cols-4 gap-3">
        {[
          ["平台健康度", "99.2%"],
          ["已纳管云账号", String(accounts.length)],
          ["云平台", `${cloudsInScope.filter((item) => item.kind === "公有云").length} 公有 + ${cloudsInScope.filter((item) => item.kind === "专属云").length} 专属`],
          ["资源总量", `${vmRows.length} 台虚拟机`],
        ].map(([label, value]) => (
          <div key={label} className="border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-[12px] text-white/55">{label}</div>
            <div className="num mt-1 text-[28px] font-semibold">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">多云资源分布 · 虚拟机</div>
          <HBar dark format={(n) => `${n} 台`} items={cloudsInScope.map((cloud) => ({ label: cloud.name, value: vmRows.filter((vm) => vm.cloudId === cloud.id).length }))} />
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">计算利用率</div>
          <LineChart dark color="#D5E4F5" values={wave(4, cpu, 8)} />
          <div className="mt-2 text-[12px] text-white/50">存储 {storages.filter((item) => inScope(state, item.domainId, item.projectId)).length} · 网络 {networks.filter((item) => inScope(state, item.domainId, item.projectId)).length} · 数据库 {databases.filter((item) => inScope(state, item.domainId, item.projectId)).length}</div>
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-[13px] text-white/70">容量水位</div>
          <div className="space-y-3">
            <Gauge label="计算池" value={cpu} />
            <Gauge label="存储池" value={68} />
            <Gauge label="EIP" value={56} />
          </div>
          <div className="mt-4 text-[12px] text-white/60">未恢复告警 {open.length} · 严重 {open.filter((item) => item.level === "严重").length}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">近 24 小时变更</div>
          <ul className="space-y-2 text-[13px] text-white/80">
            <li>08:12 阿里云生产账号同步 14 项变更</li>
            <li>07:42 rm-web-01 CPU 告警触发</li>
            <li>06:42 天翼云专属云同步超时后重试</li>
          </ul>
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">CPU 使用率 TOP5</div>
          <HBar dark format={(n) => `${n}%`} items={top.map((vm) => ({ label: vm.name, value: vm.cpuAvg, color: vm.cpuAvg > 80 ? "#C8102E" : "#D5E4F5" }))} />
        </div>
      </div>
      <p className="mt-3 text-[11px] text-white/40">示意数据 · 口径与管理台一致 · 大屏复用平台权限</p>
    </ScreenChrome>
  );
}
