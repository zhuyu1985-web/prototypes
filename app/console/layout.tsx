"use client";

import { AuthGate } from "@/components/bits";
import { ConsoleShell } from "@/components/shell";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <ConsoleShell>{children}</ConsoleShell>
    </AuthGate>
  );
}
