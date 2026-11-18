"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { domainName, projectName } from "@/lib/data";
import { roleMeta, viewLabel } from "@/lib/nav";
import { useApp } from "@/lib/store";
import type { RoleId } from "@/lib/types";
import { Card } from "@/components/ui";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { state, ready } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (ready && !state.authed) router.replace("/");
  }, [ready, state.authed, router]);
  if (!ready || !state.authed) return <div className="min-h-screen bg-canvas" />;
  return children;
}

export function RequireRole({ allow, children }: { allow: RoleId[]; children: React.ReactNode }) {
  const { state } = useApp();
  if (!allow.includes(state.role)) {
    return (
      <Card>
        <h1 className="text-[18px] font-semibold text-navy">当前身份无权访问</h1>
        <p className="mt-2 text-[13px] leading-6 text-muted">
          需要{allow.map((role) => roleMeta[role].label).join("、")}。可在顶栏切换身份查看差异。这是一期权限示意，不会改动真实授权。
        </p>
      </Card>
    );
  }
  return children;
}

export function ScopeHint() {
  const { state } = useApp();
  const scope = state.view === "admin" ? "集团" : state.view === "domain" ? domainName(state.domainId) : projectName(state.projectId);
  return <p className="mb-4 text-[12px] text-muted">当前范围 · {viewLabel[state.view]} · {scope} · {roleMeta[state.role].person}</p>;
}

export function statusTone(status: string): "ok" | "warn" | "danger" | "info" | "neutral" {
  if (["运行中", "正常", "可用", "已绑定", "使用中", "已通过", "已关闭", "成功", "已验证", "已生成", "启用"].includes(status)) return "ok";
  if (["已停止", "凭据将过期", "同步延迟", "警告", "待审批", "待处理", "待交付", "处理中", "审批中", "待厂商回复", "待验证", "未绑定"].includes(status)) return "warn";
  if (["同步异常", "严重", "已拦截", "已超时", "高危", "连接失败", "内容拦截", "公共读写", "未恢复"].includes(status)) return "danger";
  if (["已驳回", "已恢复", "空闲"].includes(status)) return "neutral";
  return "info";
}
