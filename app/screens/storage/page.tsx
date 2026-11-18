"use client";

import { wave } from "@/lib/format";
import { ScreenChrome } from "@/components/shell";
import { Donut, HBar, LineChart } from "@/components/charts";

export default function StorageScreen() {
  return (
    <ScreenChrome title="存储分析">
      <div className="grid grid-cols-4 gap-3">
        {[
          ["总容量", "148 TB"],
          ["对象数", "2.6 亿"],
          ["本月净增", "6.4 TB"],
          ["外网流出", "¥86,400"],
        ].map(([label, value]) => (
          <div key={label} className="border border-white/10 bg-white/5 px-4 py-3"><div className="text-[12px] text-white/55">{label}</div><div className="num mt-1 text-[26px] font-semibold">{value}</div></div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">文件类型</div>
          <Donut dark items={[
            { label: "视频", value: 58, color: "#D5E4F5" },
            { label: "图片", value: 22, color: "#8FB4D6" },
            { label: "音频", value: 8, color: "#C8102E" },
            { label: "文档", value: 12, color: "#E7B3BE" },
          ]} />
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">业务前缀</div>
          <HBar dark format={(n) => `${n} TB`} items={[{ label: "融媒成片", value: 62 }, { label: "财经图片", value: 24 }, { label: "技术日志", value: 9 }, { label: "财务归档", value: 18 }]} />
        </div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">存储层级</div>
          <HBar dark format={(n) => `${n}%`} items={[{ label: "标准", value: 64 }, { label: "低频", value: 18 }, { label: "归档", value: 14 }, { label: "冷归档", value: 4 }]} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="border border-white/10 bg-white/5 p-4"><div className="mb-2 text-[13px] text-white/70">容量增长</div><LineChart dark color="#D5E4F5" values={wave(5, 140, 8)} /></div>
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[13px] text-white/70">计费项</div>
          <HBar dark items={[{ label: "容量费", value: 420000 }, { label: "请求费", value: 36000 }, { label: "取回费", value: 28000 }, { label: "外网流出", value: 86400 }]} />
        </div>
      </div>
      <p className="mt-3 text-[11px] text-white/40">示意数据 · 用于看冷热分层，不替代账单</p>
    </ScreenChrome>
  );
}
