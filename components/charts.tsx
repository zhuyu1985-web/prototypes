import { yuanShort } from "@/lib/format";

export function LineChart({ values, color = "#0B1F3A", height = 112, dark = false }: { values: number[]; color?: string; height?: number; dark?: boolean }) {
  const width = 360;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * (width - 8) + 4;
    const y = height - 10 - ((value - min) / span) * (height - 20);
    return [x, y] as const;
  });
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ");
  const area = `${line} L${points[points.length - 1]?.[0] ?? 0},${height} L${points[0]?.[0] ?? 0},${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="趋势">
      {[0, 1, 2, 3].map((row) => (
        <line key={row} x1="0" x2={width} y1={(height / 4) * row} y2={(height / 4) * row} stroke={dark ? "rgba(255,255,255,0.08)" : "#E4E9F0"} />
      ))}
      <path d={area} fill={color} opacity={dark ? 0.18 : 0.12} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export function HBar({ items, dark = false, format = yuanShort }: { items: { label: string; value: number; color?: string }[]; dark?: boolean; format?: (n: number) => string }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-[12px]">
            <span className="truncate">{item.label}</span>
            <span className="num shrink-0">{format(item.value)}</span>
          </div>
          <div className={dark ? "h-1.5 bg-white/10" : "h-1.5 bg-[#EEF1F5]"}>
            <div className="h-1.5" style={{ width: `${(item.value / max) * 100}%`, background: item.color ?? (dark ? "#D5E4F5" : "#0B1F3A") }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Donut({ items, dark = false }: { items: { label: string; value: number; color: string }[]; dark?: boolean }) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0">
        {items.map((item) => {
          const length = (item.value / total) * circ;
          const node = (
            <circle
              key={item.label}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="12"
              strokeDasharray={`${length} ${circ - length}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
            />
          );
          offset += length;
          return node;
        })}
      </svg>
      <ul className={cnList(dark)}>
        {items.slice(0, 8).map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-1.5"><i className="h-2 w-2 shrink-0" style={{ background: item.color }} />{item.label}</span>
            <span className="num text-[11px] opacity-80">{Math.round((item.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function cnList(dark: boolean): string {
  return dark ? "min-w-0 flex-1 space-y-1 text-[12px] text-white/80" : "min-w-0 flex-1 space-y-1 text-[12px] text-[#3D4C60]";
}

export function Gauge({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[12px] text-white/70">
        <span>{label}</span>
        <span className="num text-white">{value.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 bg-white/10">
        <div className="h-1.5" style={{ width: `${Math.min(value, 100)}%`, background: value >= 85 ? "#C8102E" : "#D5E4F5" }} />
      </div>
    </div>
  );
}
