"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { searchAll } from "@/lib/search";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/ui";

function SearchBody() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const { state } = useApp();
  const hits = searchAll(state, q);
  return (
    <div>
      <PageHeader title="搜索" desc={q ? `「${q}」共 ${hits.length} 条` : "输入资源名或工单号。"} />
      <ul className="space-y-2">
        {hits.map((hit) => (
          <li key={hit.href + hit.title}><Link href={hit.href} className="block rounded-lg border border-line bg-white px-4 py-3"><span className="text-[12px] text-muted">{hit.type}</span><div className="text-[14px] text-navy">{hit.title}</div><div className="text-[12px] text-muted">{hit.hint}</div></Link></li>
        ))}
      </ul>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<p className="text-[13px] text-muted">正在检索</p>}><SearchBody /></Suspense>;
}
