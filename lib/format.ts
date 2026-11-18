export function yuan(n: number): string {
  return `¥${Math.round(n).toLocaleString("zh-CN")}`;
}

export function yuanShort(n: number): string {
  if (Math.abs(n) >= 10000) {
    const wan = n / 10000;
    const digits = Math.abs(wan) >= 100 ? 1 : 2;
    return `¥${wan.toFixed(digits)} 万`;
  }
  return yuan(n);
}

export function pct(part: number, total: number): string {
  if (!total) return "0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}

export function ratioPct(used: number, amount: number): number {
  if (!amount) return 0;
  return (used / amount) * 100;
}

export function tokens(n: number): string {
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)} 亿`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)} 万`;
  return n.toLocaleString("zh-CN");
}

export function wave(seed: number, base: number, amp: number, n = 24): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i += 1) {
    const wobble = ((seed * 17 + i * 13) % 10) / 10;
    const v = base + Math.sin((i + seed) / 2.7) * amp + wobble * amp * 0.35;
    out.push(Math.round(Math.max(0, v) * 10) / 10);
  }
  return out;
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const cloudPalette = [
  "#0B1F3A",
  "#1D4E89",
  "#4E6E8E",
  "#7E93A8",
  "#C8102E",
  "#8C3A4A",
  "#A68456",
  "#3E5348",
];
