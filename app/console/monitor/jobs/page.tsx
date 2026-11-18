"use client";

import { useState } from "react";
import { jobs } from "@/lib/data";
import { RequireRole } from "@/components/bits";
import { Card, DemoNote, PageHeader, PhaseTag } from "@/components/ui";

export default function JobsPage() {
  const [id, setId] = useState(jobs[0]?.id ?? "");
  const job = jobs.find((item) => item.id === id) ?? jobs[0];
  return (
    <RequireRole allow={["platform_admin", "domain_admin"]}>
      <PageHeader title="定时任务" desc="同步、账单和巡检可以查看执行历史。涉及开关机的任务只登记计划。" />
      <div className="grid grid-cols-[280px_1fr] gap-4">
        <div className="space-y-2">
          {jobs.map((item) => (
            <button key={item.id} type="button" onClick={() => setId(item.id)} className={`w-full rounded-lg border p-3 text-left ${item.id === job.id ? "border-navy bg-white" : "border-line bg-white"}`}>
              <div className="flex items-center gap-2 text-[14px] font-medium text-navy">{item.name}{item.phase ? <PhaseTag phase={item.phase} /> : null}</div>
              <div className="mt-1 text-[12px] text-muted">{item.schedule}</div>
            </button>
          ))}
        </div>
        <Card>
          <h2 className="text-[16px] font-semibold text-navy">{job.name}</h2>
          <p className="mt-2 text-[13px] leading-6 text-muted">{job.note}</p>
          <p className="mt-2 text-[13px]">最近：{job.lastRun} · {job.lastResult}</p>
          <table className="mt-4 w-full text-left text-[13px]">
            <tbody>
              {job.history.map((item) => <tr key={item.time} className="border-t border-line"><td className="py-2">{item.time}</td><td>{item.result}</td></tr>)}
            </tbody>
          </table>
        </Card>
      </div>
      <DemoNote />
    </RequireRole>
  );
}
