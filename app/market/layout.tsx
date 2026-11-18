"use client";

import { AuthGate } from "@/components/bits";
import { MarketChrome } from "@/components/shell";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate><MarketChrome>{children}</MarketChrome></AuthGate>;
}
