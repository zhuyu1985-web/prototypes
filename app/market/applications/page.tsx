"use client";

import Link from "next/link";
import { projectName } from "@/lib/data";
import { useApp } from "@/lib/store";
import { statusTone } from "@/components/bits";
import { Badge, DemoNote } from "@/components/ui";

export default function ApplicationsPage() {
  const { state } = useApp();
  return (
    <div>
      <h1 className="text-[24px] font-semibold text-navy">我的申请</h1>
      <div className="mt-4 space-y-3">
        {state.applications.map((item) => (
          <Link key={item.id} href={`/market/applications/${item.id}`} className="block rounded-lg border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-navy">{item.id} · {item.title}</span>
              <Badge tone={statusTone(item.status)}>{item.status}</Badge>
            </div>
            <p className="mt-2 text-[13px] text-muted">{item.specName} × {item.qty} · {item.cycle} · {projectName(item.projectId)} · {item.createdAt}</p>
          </Link>
        ))}
      </div>
      <DemoNote />
    </div>
  );
}
