import type { RoleId, ViewLevel } from "@/lib/types";

export const roleMeta: Record<RoleId, { label: string; person: string; org: string }> = {
  platform_admin: { label: "平台管理员", person: "周启明", org: "集团云平台运营" },
  domain_admin: { label: "域管理员", person: "林知夏", org: "融媒云事业部" },
  project_owner: { label: "项目所有者", person: "陈予安", org: "融媒云平台" },
  business: { label: "业务用户", person: "沈清和", org: "内容生产中台" },
  finance: { label: "财务", person: "顾衡", org: "财务共享中心" },
};

export const viewLabel: Record<ViewLevel, string> = {
  admin: "管理后台",
  domain: "域管理后台",
  project: "项目视图",
};

const ALL: RoleId[] = ["platform_admin", "domain_admin", "project_owner", "business", "finance"];
const ADMINS: RoleId[] = ["platform_admin", "domain_admin"];
const OPS: RoleId[] = ["platform_admin", "domain_admin", "project_owner"];
const NOT_FINANCE: RoleId[] = ["platform_admin", "domain_admin", "project_owner", "business"];
const MONEY: RoleId[] = ["platform_admin", "domain_admin", "finance"];

export type NavItem = {
  href: string;
  label: string;
  roles: RoleId[];
  phase?: "二期开放" | "三期开放";
};

export type NavGroup = { group: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  { group: "总览", items: [{ href: "/console/overview", label: "平台总览", roles: ALL }] },
  {
    group: "多云资源",
    items: [
      { href: "/console/accounts", label: "云账号", roles: ADMINS },
      { href: "/console/compute", label: "计算资源", roles: NOT_FINANCE },
      { href: "/console/network", label: "网络资源", roles: NOT_FINANCE },
      { href: "/console/storage", label: "存储资源", roles: NOT_FINANCE },
      { href: "/console/database", label: "数据库与中间件", roles: NOT_FINANCE },
      { href: "/console/org", label: "组织与权限", roles: [...ADMINS, "project_owner"] },
      { href: "/console/security", label: "安全检查", roles: ADMINS },
      { href: "/console/audit", label: "操作审计", roles: ADMINS },
    ],
  },
  {
    group: "AI 调度",
    items: [
      { href: "/console/ai", label: "调度总览", roles: [...OPS, "business"] },
      { href: "/console/ai/models", label: "模型目录", roles: [...OPS, "business"] },
      { href: "/console/ai/keys", label: "虚拟 API Key", roles: OPS },
      { href: "/console/ai/routes", label: "路由规则", roles: ADMINS },
      { href: "/console/ai/quota", label: "配额与限流", roles: [...ADMINS, "project_owner"] },
      { href: "/console/ai/audit", label: "调用审计", roles: [...OPS, "finance"] },
      { href: "/console/ai/safety", label: "内容安全", roles: ADMINS },
      { href: "/console/ai/scenes", label: "场景应用", roles: [...OPS, "business"] },
    ],
  },
  {
    group: "费用运营",
    items: [
      { href: "/console/billing", label: "账单", roles: MONEY },
      { href: "/console/billing/analysis", label: "多维分析", roles: MONEY },
      { href: "/console/billing/forecast", label: "预算与预测", roles: MONEY },
      { href: "/console/billing/optimize", label: "成本优化", roles: [...MONEY, "project_owner"] },
      { href: "/console/billing/compare", label: "跨云比价", roles: MONEY },
      { href: "/console/reports", label: "运营报表", roles: MONEY },
    ],
  },
  {
    group: "市场运营",
    items: [
      { href: "/console/market-ops", label: "产品上架", roles: ["platform_admin"] },
      { href: "/console/market-ops/approvals", label: "审批台", roles: ADMINS },
    ],
  },
  { group: "工单", items: [{ href: "/console/tickets", label: "工单台账", roles: ALL }] },
  {
    group: "运维监控",
    items: [
      { href: "/console/monitor", label: "监控总览", roles: NOT_FINANCE },
      { href: "/console/monitor/panels", label: "自定义面板", roles: [...ADMINS, "project_owner"] },
      { href: "/console/monitor/policies", label: "告警策略", roles: ADMINS },
      { href: "/console/monitor/alerts", label: "告警中心", roles: NOT_FINANCE },
      { href: "/console/monitor/maintenance", label: "维护屏蔽", roles: ADMINS },
      { href: "/console/monitor/channels", label: "通知渠道", roles: ADMINS },
      { href: "/console/monitor/jobs", label: "定时任务", roles: ADMINS },
      { href: "/console/monitor/inspection", label: "环境巡检", roles: ADMINS },
      { href: "/console/monitor/orchestration", label: "应用编排", roles: ADMINS, phase: "二期开放" },
    ],
  },
];

export function allowedViews(role: RoleId): ViewLevel[] {
  switch (role) {
    case "platform_admin":
    case "finance":
      return ["admin", "domain", "project"];
    case "domain_admin":
      return ["domain"];
    case "project_owner":
    case "business":
      return ["project"];
    default: {
      const neverRole: never = role;
      return neverRole;
    }
  }
}

export function homeFor(role: RoleId): { view: ViewLevel; domainId: "tech" | "media" | "fusion" | "finance"; projectId: "fusion-platform" | "fusion-cms" | "tech-platform" | "tech-data" | "media-site" | "fin-core" } {
  switch (role) {
    case "platform_admin":
      return { view: "admin", domainId: "fusion", projectId: "fusion-platform" };
    case "domain_admin":
      return { view: "domain", domainId: "fusion", projectId: "fusion-platform" };
    case "project_owner":
      return { view: "project", domainId: "fusion", projectId: "fusion-platform" };
    case "business":
      return { view: "project", domainId: "fusion", projectId: "fusion-cms" };
    case "finance":
      return { view: "admin", domainId: "finance", projectId: "fin-core" };
    default: {
      const neverRole: never = role;
      return neverRole;
    }
  }
}

export function canSee(roles: RoleId[], role: RoleId): boolean {
  return roles.includes(role);
}

const titleMap: { prefix: string; title: string }[] = [
  { prefix: "/console/overview", title: "平台总览" },
  { prefix: "/console/accounts/connect", title: "接入云账号" },
  { prefix: "/console/accounts", title: "云账号" },
  { prefix: "/console/compute/containers", title: "容器主机" },
  { prefix: "/console/compute/scheduling", title: "调度策略" },
  { prefix: "/console/compute", title: "计算资源" },
  { prefix: "/console/network", title: "网络资源" },
  { prefix: "/console/storage", title: "存储资源" },
  { prefix: "/console/database", title: "数据库与中间件" },
  { prefix: "/console/org", title: "组织与权限" },
  { prefix: "/console/security", title: "安全检查" },
  { prefix: "/console/audit", title: "操作审计" },
  { prefix: "/console/ai/models", title: "模型目录" },
  { prefix: "/console/ai/keys", title: "虚拟 API Key" },
  { prefix: "/console/ai/routes", title: "路由规则" },
  { prefix: "/console/ai/quota", title: "配额与限流" },
  { prefix: "/console/ai/audit", title: "调用审计" },
  { prefix: "/console/ai/safety", title: "内容安全" },
  { prefix: "/console/ai/scenes", title: "场景应用" },
  { prefix: "/console/ai", title: "AI 调度中心" },
  { prefix: "/console/billing/analysis", title: "多维费用分析" },
  { prefix: "/console/billing/forecast", title: "预算与预测" },
  { prefix: "/console/billing/optimize", title: "成本优化" },
  { prefix: "/console/billing/compare", title: "跨云比价" },
  { prefix: "/console/billing", title: "账单" },
  { prefix: "/console/reports", title: "运营报表" },
  { prefix: "/console/market-ops/approvals", title: "审批台" },
  { prefix: "/console/market-ops", title: "产品上架" },
  { prefix: "/console/tickets/new", title: "新建工单" },
  { prefix: "/console/tickets", title: "工单" },
  { prefix: "/console/monitor/panels", title: "自定义面板" },
  { prefix: "/console/monitor/policies", title: "告警策略" },
  { prefix: "/console/monitor/alerts", title: "告警" },
  { prefix: "/console/monitor/maintenance", title: "维护屏蔽" },
  { prefix: "/console/monitor/channels", title: "通知渠道" },
  { prefix: "/console/monitor/jobs", title: "定时任务" },
  { prefix: "/console/monitor/inspection", title: "环境巡检" },
  { prefix: "/console/monitor/orchestration", title: "应用编排" },
  { prefix: "/console/monitor", title: "监控总览" },
  { prefix: "/console/messages", title: "消息中心" },
  { prefix: "/console/search", title: "搜索" },
];

export function titleFor(pathname: string): string {
  const hit = titleMap.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`));
  return hit?.title ?? "每经云";
}
