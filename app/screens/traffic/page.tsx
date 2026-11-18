"use client";

import { wave } from "@/lib/format";
import { ScreenChrome } from "@/components/shell";
import { Donut, HBar, LineChart } from "@/components/charts";

export default function TrafficScreen() {
  return (
    <ScreenChrome title="流量分析">
      <div className="grid grid-cols-4 gap-3">
        {[
          ["总访问流量", "186 TB"],
          ["入向峰值", "12.4 Gbps"],
          ["出向峰值", "28.6 Gbps"],
          ["95 峰值", "21.2 Gbps"],
        ].map(([label, value]) => (
          <div key={label} className="border border-white/10 bg-white/5 px-4 py-3"><div className="text-[12px] text-white/55">{label}</div><div className="num mt-1 text-[26px] font-semibold">{value}</div></div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="border border-white/10 bg-white/5 p-4"><div className="mb-2 text-[13px] text-white/70">带宽趋势</div><LineChart dark color="#D5E4F5" values={wave(2, 18, 6)} /></div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">协议占比</div>
          <Donut dark items={[
            { label: "HTTPS", value: 62, color: "#D5E4F5" },
            { label: "HTTP", value: 14, color: "#8FB4D6" },
            { label: "HTTP/2", value: 16, color: "#C8102E" },
            { label: "QUIC", value: 6, color: "#E7B3BE" },
            { label: "WebSocket", value: 2, color: "#8C3A4A" },
          ]} />
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">运营商</div>
          <HBar dark format={(n) => `${n}%`} items={[{ label: "电信", value: 38 }, { label: "联通", value: 22 }, { label: "移动", value: 27 }, { label: "广电", value: 6 }, { label: "教育网", value: 4 }, { label: "海外", value: 3 }]} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-[13px]">
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="text-white/70">请求</div>
          <div className="num mt-1 text-[24px]">4.8 亿</div>
          <div className="text-white/50">峰值 QPS 18,400 · 均值 6,200</div>
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-white/70">地域请求</div>
          <HBar dark format={(n) => `${n}%`} items={[{ label: "上海", value: 28 }, { label: "北京", value: 18 }, { label: "广东", value: 16 }, { label: "浙江", value: 14 }, { label: "四川", value: 9 }]} />
        </div>
      </div>
      <p className="mt-3 text-[11px] text-white/40">示意数据 · 负载均衡含入向与出向，CDN 以下行为主</p>
    </ScreenChrome>
  );
}
