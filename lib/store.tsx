"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { budgets, initialAccounts, initialApplications, initialAudits, initialKeys, initialMessages, initialPolicies, initialRoutes, initialTickets, products, projectById } from "@/lib/data";
import { homeFor, roleMeta } from "@/lib/nav";
import type { AlertPolicy, Application, AuditEvent, CartLine, CloudAccount, CloudId, DomainId, Product, ProjectId, ReportDoc, RoleId, RouteRule, Ticket, ViewLevel, VirtualKey, AppMessage } from "@/lib/types";

export type Silence = { id: string; window: string; scope: string; policy: string };

export type AppState = {
  authed: boolean;
  role: RoleId;
  view: ViewLevel;
  domainId: DomainId;
  projectId: ProjectId;
  accounts: CloudAccount[];
  cart: CartLine[];
  applications: Application[];
  tickets: Ticket[];
  keys: VirtualKey[];
  routes: RouteRule[];
  productsExtra: Product[];
  ignoredOpts: string[];
  silences: Silence[];
  messages: AppMessage[];
  audits: AuditEvent[];
  policies: AlertPolicy[];
  reportsExtra: ReportDoc[];
  safety: { inputScan: boolean; maskPii: boolean; outboundBlock: boolean };
  serial: number;
  toasts: { id: string; text: string }[];
};

const STORAGE_KEY = "mjy-proto-1";

function blueprint(): AppState {
  return {
    authed: false,
    role: "platform_admin",
    view: "admin",
    domainId: "fusion",
    projectId: "fusion-platform",
    accounts: initialAccounts,
    cart: [],
    applications: initialApplications,
    tickets: initialTickets,
    keys: initialKeys,
    routes: initialRoutes,
    productsExtra: [],
    ignoredOpts: [],
    silences: [{ id: "mw-1", window: "2026-11-20 01:00–03:00", scope: "融媒云平台", policy: "虚拟机 CPU" }],
    messages: initialMessages,
    audits: initialAudits,
    policies: initialPolicies,
    reportsExtra: [],
    safety: { inputScan: true, maskPii: true, outboundBlock: false },
    serial: 1846,
    toasts: [],
  };
}

type Store = {
  state: AppState;
  ready: boolean;
  login: () => void;
  logout: () => void;
  setRole: (role: RoleId) => void;
  setView: (view: ViewLevel) => void;
  setDomain: (id: DomainId) => void;
  setProject: (id: ProjectId) => void;
  addAccount: (input: { name: string; cloudId: CloudId; domainId: DomainId; regions: string[]; billCollect: string; syncCron: string }) => void;
  checkAccount: (id: string) => void;
  addToCart: (line: Omit<CartLine, "lineId">) => void;
  removeCart: (lineId: string) => void;
  submitCart: () => { ok: boolean; id: string };
  approve: (id: string) => void;
  reject: (id: string) => void;
  publishProduct: (product: Product) => void;
  issueKey: (input: { name: string; projectId: ProjectId; modelIds: string[]; qps: number; tokenQuota: number }) => VirtualKey;
  saveRoute: (id: string, weights: { modelId: string; weight: number }[]) => void;
  toggleSafety: (key: keyof AppState["safety"]) => void;
  addTicket: (input: { type: string; title: string; content: string; projectId: ProjectId }) => Ticket;
  addComment: (ticketId: string, text: string) => void;
  ignoreOpt: (id: string) => void;
  rectify: (title: string, projectId: ProjectId) => Ticket;
  silenceAlert: (policy: string) => void;
  togglePolicy: (id: string) => void;
  addReport: () => void;
  markAllRead: () => void;
  toast: (text: string) => void;
  resetDemo: () => void;
};

const Ctx = createContext<Store | null>(null);

function withAudit(state: AppState, action: string, target: string, result: "成功" | "拒绝" = "成功"): AppState {
  const event: AuditEvent = {
    id: `aud-${Date.now()}`,
    time: "本会话",
    actor: roleMeta[state.role].person,
    role: roleMeta[state.role].label,
    action,
    target,
    result,
    source: "平台",
  };
  return { ...state, audits: [event, ...state.audits] };
}

function toastOf(state: AppState, text: string): AppState {
  return { ...state, toasts: [{ id: `t-${Date.now()}`, text }] };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(blueprint);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        setState({ ...blueprint(), ...parsed, toasts: [] });
      }
    } catch {
      setState(blueprint());
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, toasts: [] }));
  }, [state, ready]);

  const api = useMemo<Store>(() => {
    const update = (fn: (prev: AppState) => AppState) => setState(fn);
    return {
      state,
      ready,
      login: () => update((prev) => ({ ...prev, authed: true })),
      logout: () => update((prev) => ({ ...prev, authed: false })),
      setRole: (role) => update((prev) => ({ ...prev, role, ...homeFor(role) })),
      setView: (view) => update((prev) => ({ ...prev, view })),
      setDomain: (domainId) => update((prev) => ({ ...prev, domainId })),
      setProject: (projectId) => update((prev) => ({ ...prev, projectId })),
      addAccount: (input) => update((prev) => {
        const account: CloudAccount = {
          id: `acc-session-${prev.accounts.length}`,
          name: input.name,
          cloudId: input.cloudId,
          domainId: input.domainId,
          health: "正常",
          lastSync: "尚未同步",
          balance: null,
          balanceThreshold: 30000,
          discountLabel: "待首次账单采集",
          access: "只读",
          session: true,
          regions: input.regions,
          billCollect: input.billCollect,
          syncCron: input.syncCron,
        };
        return toastOf(withAudit({ ...prev, accounts: [account, ...prev.accounts] }, "接入云账号", account.name), "云账号已接入，资源将按同步任务进入台账");
      }),
      checkAccount: (id) => update((prev) => toastOf({
        ...prev,
        accounts: prev.accounts.map((item) => item.id === id ? { ...item, lastSync: "刚刚完成健康检查", health: item.health === "连接失败" ? "正常" : item.health } : item),
      }, "健康检查完成：凭据有效，当前为只读权限")),
      addToCart: (line) => update((prev) => toastOf({
        ...prev,
        cart: [...prev.cart, { ...line, lineId: `line-${Date.now()}` }],
      }, "已加入购物车")),
      removeCart: (lineId) => update((prev) => ({ ...prev, cart: prev.cart.filter((item) => item.lineId !== lineId) })),
      submitCart: () => {
        let created = "APP-2026-1118";
        update((prev) => {
          if (prev.cart.length === 0) return prev;
          const line = prev.cart[0];
          const product = [...products, ...prev.productsExtra].find((item) => item.id === line.productId);
          const project = projectById(line.projectId);
          const budget = budgets.find((item) => item.refId === line.projectId);
          const overBudget = Boolean(budget && budget.used >= budget.amount && line.cycle === "包月");
          const overOss = product?.id === "oss-std" && line.projectId === "fusion-cms" && line.qty > 4;
          const overVm = product?.category === "计算" && line.projectId === "fusion-platform" && line.qty > 12;
          const blocked = overBudget || overOss || overVm;
          const reason = overOss
            ? "超出内容生产中台对象存储配额（上限 20TB，已用 16TB）。"
            : overVm
              ? "超出融媒云平台虚拟机配额，剩余 12 台。"
              : overBudget
                ? "项目月预算执行已达 100%，包月申请被拦截。"
                : "配额校验通过，预算未达到 100% 拦截线。";
          created = prev.applications.some((item) => item.id === "APP-2026-1118") ? `APP-2026-${1118 + prev.serial - 1846}` : "APP-2026-1118";
          const app: Application = {
            id: created,
            title: `${product?.name ?? "云产品"} · ${project?.name ?? ""}`,
            productName: product?.name ?? "云产品",
            specName: product?.specs.find((spec) => spec.id === line.specId)?.name ?? line.specId,
            qty: line.qty,
            cycle: line.cycle === "包月" ? `包月 × ${line.months}` : "按量",
            projectId: line.projectId,
            domainId: project?.domainId ?? "fusion",
            applicant: roleMeta[prev.role].person,
            createdAt: "本会话",
            status: blocked ? "已拦截" : "待审批",
            reason,
            session: true,
          };
          return toastOf(withAudit({
            ...prev,
            cart: prev.cart.slice(1),
            applications: [app, ...prev.applications],
          }, blocked ? "拦截申请" : "提交申请", app.id, blocked ? "拒绝" : "成功"), blocked ? "申请已被配额或预算拦截" : "申请已提交，等待审批");
        });
        return { ok: true, id: created };
      },
      approve: (id) => update((prev) => {
        const app = prev.applications.find((item) => item.id === id);
        if (!app || app.status !== "待审批") return prev;
        const no = `TK-2026-${prev.serial}`;
        const ticket: Ticket = {
          id: `tk-${prev.serial}`,
          no,
          type: "主机申请",
          title: `主机申请 · ${app.title}`,
          domainId: app.domainId,
          projectId: app.projectId,
          status: "待交付",
          applicant: app.applicant,
          createdAt: "本会话",
          overdue: false,
          content: `规格 ${app.specName} × ${app.qty}，${app.cycle}。一期不在本平台自动开通资源，请云运营按既有渠道完成开通，并在本工单登记交付结果。`,
          phaseNote: "自动化交付二期开放",
          sourceApp: app.id,
          comments: [],
          flow: [
            { name: "提交申请", result: "已完成", actor: app.applicant, time: app.createdAt },
            { name: "配额与预算校验", result: "通过", actor: "平台", time: "本会话" },
            { name: "部门审批", result: "通过", actor: roleMeta[prev.role].person, time: "本会话" },
            { name: "工单登记交付", result: "待运营开通", actor: "云运营", time: "—" },
          ],
          oa: {
            pushed: "已推送",
            status: "已回传",
            opinion: "同意。按一期口径转工单开通，不在平台自动创建资源。",
            nodes: [
              { name: "申请人", result: "已提交", actor: app.applicant, time: app.createdAt },
              { name: "部门管理员", result: "同意", actor: roleMeta[prev.role].person, time: "本会话" },
            ],
          },
        };
        return toastOf(withAudit({
          ...prev,
          serial: prev.serial + 1,
          applications: prev.applications.map((item) => item.id === id ? { ...item, status: "已通过", ticketNo: no } : item),
          tickets: [ticket, ...prev.tickets],
        }, "审批通过", `${app.id} → ${no}`), `已通过，并生成交付工单 ${no}`);
      }),
      reject: (id) => update((prev) => toastOf(withAudit({
        ...prev,
        applications: prev.applications.map((item) => item.id === id ? { ...item, status: "已驳回", reason: "审批驳回。请调整规格或项目后重新申请。" } : item),
      }, "驳回申请", id, "拒绝"), "申请已驳回")),
      publishProduct: (product) => update((prev) => toastOf({ ...prev, productsExtra: [product, ...prev.productsExtra] }, "产品已上架到本会话目录")),
      issueKey: (input) => {
        const key: VirtualKey = {
          id: `key-session-${Date.now()}`,
          name: input.name,
          mask: "mjy-demo-••••-4c21",
          reveal: "mjy-demo-rongmei-0007",
          projectId: input.projectId,
          modelIds: input.modelIds,
          qps: input.qps,
          tokenQuota: input.tokenQuota,
          usedTokens: 0,
          createdAt: "本会话",
          status: "启用",
          session: true,
        };
        update((prev) => toastOf(withAudit({ ...prev, keys: [key, ...prev.keys] }, "签发虚拟 API Key", `${key.name} · ${key.mask}`), "虚拟 API Key 已签发，用量将按项目归集"));
        return key;
      },
      saveRoute: (id, weights) => update((prev) => toastOf(withAudit({
        ...prev,
        routes: prev.routes.map((rule) => rule.id === id ? { ...rule, weights } : rule),
      }, "更新路由规则", id), "路由规则已保存，调用将按新权重分发")),
      toggleSafety: (key) => update((prev) => ({ ...prev, safety: { ...prev.safety, [key]: !prev.safety[key] } })),
      addTicket: (input) => {
        let made: Ticket | null = null;
        update((prev) => {
          const project = projectById(input.projectId);
          const ticket: Ticket = {
            id: `tk-${prev.serial}`,
            no: `TK-2026-${prev.serial}`,
            type: input.type,
            title: input.title,
            domainId: project?.domainId ?? prev.domainId,
            projectId: input.projectId,
            status: "待处理",
            applicant: roleMeta[prev.role].person,
            createdAt: "本会话",
            overdue: false,
            content: input.content,
            phaseNote: input.type.includes("主机") ? "资源变更二期开放，本期仅登记" : undefined,
            comments: [],
            flow: [{ name: "提交", result: "已完成", actor: roleMeta[prev.role].person, time: "本会话" }],
          };
          made = ticket;
          return toastOf(withAudit({ ...prev, serial: prev.serial + 1, tickets: [ticket, ...prev.tickets] }, "新建工单", ticket.no), `工单 ${ticket.no} 已创建`);
        });
        return made as unknown as Ticket;
      },
      addComment: (ticketId, text) => update((prev) => ({
        ...prev,
        tickets: prev.tickets.map((ticket) => ticket.id === ticketId ? {
          ...ticket,
          comments: [...ticket.comments, { actor: roleMeta[prev.role].person, time: "本会话", text }],
        } : ticket),
      })),
      ignoreOpt: (id) => update((prev) => toastOf({ ...prev, ignoredOpts: [...prev.ignoredOpts, id] }, "已在本会话忽略该建议")),
      rectify: (title, projectId) => {
        let made: Ticket | null = null;
        update((prev) => {
          const project = projectById(projectId);
          const ticket: Ticket = {
            id: `tk-${prev.serial}`,
            no: `TK-2026-${prev.serial}`,
            type: "技术支持",
            title: `安全整改 · ${title}`,
            domainId: project?.domainId ?? "fusion",
            projectId,
            status: "待处理",
            applicant: roleMeta[prev.role].person,
            createdAt: "本会话",
            overdue: false,
            content: "一期不直接修改安全组或存储策略。本工单用于跟踪既有渠道上的整改。一键处理于二期开放。",
            phaseNote: "一键处理二期开放",
            comments: [],
            flow: [{ name: "登记", result: "已完成", actor: roleMeta[prev.role].person, time: "本会话" }],
          };
          made = ticket;
          return toastOf(withAudit({ ...prev, serial: prev.serial + 1, tickets: [ticket, ...prev.tickets] }, "登记整改工单", ticket.no), `已登记整改工单 ${ticket.no}`);
        });
        return made as unknown as Ticket;
      },
      silenceAlert: (policy) => update((prev) => toastOf({
        ...prev,
        silences: [{ id: `mw-${Date.now()}`, window: "本会话起 2 小时", scope: "当前告警资源", policy }, ...prev.silences],
      }, "已加入维护屏蔽（示意，未下发到云平台）")),
      togglePolicy: (id) => update((prev) => ({
        ...prev,
        policies: prev.policies.map((policy) => policy.id === id ? { ...policy, enabled: !policy.enabled } : policy),
      })),
      addReport: () => update((prev) => toastOf({
        ...prev,
        reportsExtra: [{ id: `report-${Date.now()}`, name: "本会话生成的资源日报", kind: "日报", period: "2026-11-18", status: "已生成", session: true }, ...prev.reportsExtra],
      }, "已按模板生成本会话日报")),
      markAllRead: () => update((prev) => ({ ...prev, messages: prev.messages.map((item) => ({ ...item, unread: false })) })),
      toast: (text) => update((prev) => toastOf(prev, text)),
      resetDemo: () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setState({ ...blueprint(), authed: true });
      },
    };
  }, [ready, state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("AppProvider 缺失");
  return ctx;
}
