"use client";

import Link from "next/link";
import { scenes } from "@/lib/data";
import { PageHeader } from "@/components/ui";

export default function ScenesPage() {
  return (
    <div>
      <PageHeader title="场景应用" desc="五个平台内场景都在本地给出回应，不调用真实模型。" />
      <div className="grid grid-cols-3 gap-3">
        {scenes.map((scene) => (
          <Link key={scene.id} href={`/console/ai/scenes/${scene.id}`} className="rounded-lg border border-line bg-white p-4 hover:border-navy">
            <div className="text-[12px] text-muted">{scene.kind}</div>
            <div className="mt-1 text-[16px] font-medium text-navy">{scene.name}</div>
            <p className="mt-2 text-[13px] leading-6 text-muted">{scene.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
