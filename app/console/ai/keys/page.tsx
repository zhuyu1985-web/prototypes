"use client";

import { useState } from "react";
import { aiModels, projectName, projects } from "@/lib/data";
import { tokens } from "@/lib/format";
import { useApp } from "@/lib/store";
import { RequireRole } from "@/components/bits";
import { Badge, Button, Card, DemoNote, Field, PageHeader, fieldClass } from "@/components/ui";
import type { ProjectId, VirtualKey } from "@/lib/types";

export default function KeysPage() {
  const { state, issueKey } = useApp();
  const [name, setName] = useState("融媒云平台-内容理解");
  const [projectId, setProjectId] = useState<ProjectId>("fusion-platform");
  const [modelId, setModelId] = useState("qwen-plus");
  const [issued, setIssued] = useState<VirtualKey | null>(null);
  return (
    <RequireRole allow={["platform_admin", "domain_admin", "project_owner"]}>
      <PageHeader title="虚拟 API Key" desc="面向项目签发。密钥只在签发瞬间完整显示一次，列表里始终掩码。示意密钥不能用于真实调用。" />
      <div className="grid grid-cols-[320px_1fr] gap-4">
        <Card>
          <h2 className="text-[15px] font-semibold text-navy">签发</h2>
          <div className="mt-3 space-y-3">
            <Field label="名称"><input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} /></Field>
            <Field label="限定项目">
              <select className={fieldClass} value={projectId} onChange={(event) => setProjectId(event.target.value as ProjectId)}>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </Field>
            <Field label="可用模型">
              <select className={fieldClass} value={modelId} onChange={(event) => setModelId(event.target.value)}>
                {aiModels.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}
              </select>
            </Field>
            <Button data-testid="btn-issue-key" tone="brand" onClick={() => setIssued(issueKey({ name, projectId, modelIds: [modelId], qps: 20, tokenQuota: 2000000 }))}>签发</Button>
          </div>
          {issued?.reveal ? (
            <div className="mt-4 border border-[#F3C3CB] bg-[#FDF6F7] p-3 text-[13px]">
              <div className="text-muted">仅显示一次 · 示意密钥</div>
              <div className="num mt-1 text-navy">{issued.reveal}</div>
              <p className="mt-2 text-[12px] text-muted">已绑定 {projectName(issued.projectId)}。用量进入调用审计，按项目分摊。</p>
            </div>
          ) : null}
        </Card>
        <div className="space-y-3">
          {state.keys.map((key) => (
            <Card key={key.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[15px] font-medium text-navy">{key.name}{key.session ? " · 本会话" : ""}</div>
                  <div className="num mt-1 text-[13px] text-muted">{key.mask}</div>
                </div>
                <Badge tone="ok">{key.status}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-[12px] text-muted">
                <div>项目<div className="mt-1 text-navy">{projectName(key.projectId)}</div></div>
                <div>QPS<div className="num mt-1 text-navy">{key.qps}</div></div>
                <div>月 token 配额<div className="num mt-1 text-navy">{tokens(key.tokenQuota)}</div></div>
                <div>已用<div className="num mt-1 text-navy">{tokens(key.usedTokens)}</div></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <DemoNote />
    </RequireRole>
  );
}
