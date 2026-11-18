"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Button, Card, DemoNote, Field, PageHeader, fieldClass } from "@/components/ui";
import type { ProjectId } from "@/lib/types";

const types = ["技术支持", "主机申请", "主机调整配置", "项目配额申请", "域配额申请"];

export default function NewTicketPage() {
  const { addTicket, state } = useApp();
  const router = useRouter();
  const [type, setType] = useState(types[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [projectId, setProjectId] = useState<ProjectId>(state.projectId);
  return (
    <div>
      <PageHeader title="新建工单" desc="主机申请和配置调整只做登记。真正的开通、变配在二期才由平台执行。" />
      <Card className="max-w-2xl">
        <div className="space-y-3">
          <Field label="类型">
            <select className={fieldClass} value={type} onChange={(event) => setType(event.target.value)}>{types.map((item) => <option key={item}>{item}</option>)}</select>
          </Field>
          <Field label="项目">
            <select className={fieldClass} value={projectId} onChange={(event) => setProjectId(event.target.value as ProjectId)}>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </Field>
          <Field label="标题"><input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
          <Field label="内容"><textarea className="h-28 w-full rounded-md border border-line p-3 text-[13px]" value={content} onChange={(event) => setContent(event.target.value)} /></Field>
          <Button disabled={!title.trim() || !content.trim()} onClick={() => { addTicket({ type, title: title.trim(), content: content.trim(), projectId }); router.push("/console/tickets"); }}>提交</Button>
        </div>
      </Card>
      <DemoNote />
    </div>
  );
}
