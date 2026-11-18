import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/format";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-lg border border-line bg-white p-4", className)}>{children}</section>;
}

export function PageHeader({ title, desc, extra }: { title: string; desc?: string; extra?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-navy">{title}</h1>
        {desc ? <p className="mt-1 max-w-3xl text-[13px] leading-6 text-muted">{desc}</p> : null}
      </div>
      {extra ? <div className="flex flex-wrap items-center gap-2">{extra}</div> : null}
    </div>
  );
}

export function DemoNote({ children }: { children?: ReactNode }) {
  return <p className="mt-6 text-[12px] text-muted">{children ?? "示意数据 · 一期原型不连接真实云平台、身份源或 OA"}</p>;
}

const tones = {
  ok: "bg-[#E7F5F1] text-ok",
  warn: "bg-[#FBF3E4] text-warn",
  danger: "bg-[#F8E8EC] text-brand",
  info: "bg-[#E8EEF6] text-navy",
  neutral: "bg-[#EEF1F5] text-[#3D4C60]",
};

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[12px] font-medium", tones[tone])}>{children}</span>;
}

export function PhaseTag({ phase }: { phase: "二期开放" | "三期开放" }) {
  return <span className="inline-flex items-center rounded bg-[#F8E8EC] px-1.5 py-0.5 text-[11px] font-medium text-brand">{phase}</span>;
}

const buttonTones = {
  navy: "border-transparent bg-navy text-white hover:bg-navy-soft",
  brand: "border-transparent bg-brand text-white hover:bg-[#a30d26]",
  ghost: "border-line bg-white text-navy hover:bg-[#f7f8fa]",
  quiet: "border-transparent bg-transparent text-navy hover:bg-[#eef2f6]",
};

export function Button({
  tone = "navy",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: keyof typeof buttonTones }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-[13px] font-medium disabled:cursor-not-allowed disabled:opacity-50",
        buttonTones[tone],
        className,
      )}
    />
  );
}

export function PhaseButton({ children, phase }: { children: ReactNode; phase: "二期开放" | "三期开放" }) {
  return (
    <button type="button" disabled className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-[#f7f8fa] px-3 text-[13px] text-muted">
      {children}
      <PhaseTag phase={phase} />
    </button>
  );
}

export const fieldClass = "h-9 w-full rounded-md border border-line bg-white px-3 text-[13px] outline-none focus:border-navy";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-[13px]">
      <span className="mb-1.5 block text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Stat({ label, value, hint, tone = "default" }: { label: string; value: string; hint?: string; tone?: "default" | "danger" | "warn" }) {
  const color = tone === "danger" ? "text-brand" : tone === "warn" ? "text-warn" : "text-navy";
  return (
    <Card>
      <div className="text-[12px] text-muted">{label}</div>
      <div className={cn("num mt-2 text-[26px] font-semibold leading-none", color)}>{value}</div>
      {hint ? <div className="mt-2 text-[12px] text-muted">{hint}</div> : null}
    </Card>
  );
}

export function DataTable<T>({ columns, rows, onRow, rowTestId }: {
  columns: { key: string; title: string; className?: string; render: (row: T) => ReactNode }[];
  rows: T[];
  onRow?: (row: T) => void;
  rowTestId?: (row: T) => string | undefined;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
        <thead className="bg-[#F7F8FA] text-[12px] text-muted">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={cn("px-3 py-2 font-medium", column.className)}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-10 text-center text-muted">当前范围没有记录</td>
            </tr>
          ) : rows.map((row, index) => (
            <tr
              key={index}
              data-testid={rowTestId?.(row)}
              onClick={onRow ? () => onRow(row) : undefined}
              className={cn("border-t border-line", onRow && "cursor-pointer hover:bg-[#F7F9FC]")}
            >
              {columns.map((column) => (
                <td key={column.key} className={cn("px-3 py-2.5 align-middle", column.className)}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Drawer({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-navy/30" onClick={onClose}>
      <div className="h-full w-[460px] overflow-y-auto bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-[18px] font-semibold text-navy">{title}</h2>
          <button type="button" className="text-[13px] text-muted" onClick={onClose}>关闭</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ title, desc }: { title: string; desc: string }) {
  return (
    <Card>
      <h2 className="text-[16px] font-semibold text-navy">{title}</h2>
      <p className="mt-2 text-[13px] leading-6 text-muted">{desc}</p>
    </Card>
  );
}
