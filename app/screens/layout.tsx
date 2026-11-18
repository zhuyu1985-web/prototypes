"use client";

import { AuthGate } from "@/components/bits";

export default function ScreensLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
