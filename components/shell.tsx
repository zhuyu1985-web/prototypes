"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { domains, projects } from "@/lib/data";
import { allowedViews, canSee, navGroups, roleMeta, titleFor, viewLabel } from "@/lib/nav";
import { useApp } from "@/lib/store";
import type { DomainId, ProjectId, RoleId, ViewLevel } from "@/lib/types";
import { searchAll } from "@/lib/search";
import { PhaseTag } from "@/components/ui";

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const { state, setRole, setView, setDomain, setProject, logout, resetDemo } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const hits = useMemo(() => searchAll(state, query).slice(0, 8), [state, query]);
  const views = allowedViews(state.role);
  const active = navGroups
    .flatMap((group) => group.items)
    .filter((item) => canSee(item.roles, state.role))
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  useEffect(() => {
    document.title = `${titleFor(pathname)} · 每经云`;
  }, [pathname]);

  return (
    <div className="flex min-h-screen min-w-[1240px] bg-canvas text-ink">
      <aside className="sticky top-0 flex h-screen w-[228px] shrink-0 flex-col bg-navy text-white">
        <Link href="/console/overview" className="flex h-14 items-center gap-2.5 px-4">
          <span className="grid h-8 w-8 place-items-center bg-brand text-[14px] font-semibold">每</span>
          <span>
            <span className="block text-[15px] font-semibold leading-none">每经云</span>
            <span className="mt-1 block text-[10px] tracking-wide text-white/60">集团云管平台</span>
          </span>
        </Link>
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {navGroups.map((group) => {
            const items = group.items.filter((item) => canSee(item.roles, state.role));
            if (items.length === 0) return null;
            return (
              <div key={group.group} className="mt-3">
                <div className="px-3 py-1 text-[11px] text-white/45">{group.group}</div>
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-testid={`nav-${item.href.split("/").slice(2).join("-")}`}
                    className={`mt-0.5 flex items-center justify-between rounded px-3 py-1.5 text-[13px] ${active === item.href ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/5 hover:text-white"}`}
                    style={active === item.href ? { boxShadow: "inset 2px 0 0 #C8102E" } : undefined}
                  >
                    <span>{item.label}</span>
                    {item.phase ? <span className="text-[10px] text-[#F3C3CB]">{item.phase.slice(0, 2)}</span> : null}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white px-4">
          <div className="flex shrink-0 rounded-md border border-line p-0.5">
            {(["admin", "domain", "project"] as ViewLevel[]).map((view) => {
              const enabled = views.includes(view);
              return (
                <button
                  key={view}
                  type="button"
                  disabled={!enabled}
                  onClick={() => setView(view)}
                  className={`h-7 rounded px-2 text-[12px] ${state.view === view ? "bg-navy text-white" : "text-muted"} disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {viewLabel[view]}
                </button>
              );
            })}
          </div>
          {state.view !== "admin" ? (
            <select
              className="h-8 rounded-md border border-line bg-white px-2 text-[12px]"
              value={state.domainId}
              onChange={(event) => {
                const domainId = event.target.value as DomainId;
                setDomain(domainId);
                const next = projects.find((item) => item.domainId === domainId);
                if (next) setProject(next.id);
              }}
            >
              {domains.map((domain) => <option key={domain.id} value={domain.id}>{domain.name}</option>)}
            </select>
          ) : <span className="text-[12px] text-muted">集团全量</span>}
          {state.view === "project" ? (
            <select className="h-8 rounded-md border border-line bg-white px-2 text-[12px]" value={state.projectId} onChange={(event) => setProject(event.target.value as ProjectId)}>
              {projects.filter((item) => item.domainId === state.domainId).map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          ) : null}
          <div className="relative min-w-[220px] flex-1">
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter") router.push(`/console/search?q=${encodeURIComponent(query)}`);
              }}
              placeholder="搜索资源名、工单号"
              className="h-8 w-full rounded-md border border-line px-3 text-[13px] outline-none focus:border-navy"
              aria-label="全局搜索"
            />
            {open && query.trim() && hits.length > 0 ? (
              <div className="absolute left-0 right-0 top-9 z-40 rounded-md border border-line bg-white py-1 shadow-lg">
                {hits.map((hit) => (
                  <Link key={hit.href + hit.title} href={hit.href} onClick={() => setOpen(false)} className="block px-3 py-2 text-[13px] hover:bg-[#F7F8FA]">
                    <span className="text-[11px] text-muted">{hit.type}</span>
                    <span className="ml-2 text-navy">{hit.title}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link href="/screens/resource" data-testid="link-screen-resource" className="text-[13px] text-navy hover:text-brand">资源使用情况</Link>
          <Link href="/screens/cost" data-testid="link-screen-cost" className="text-[13px] text-navy hover:text-brand">费用统计分析</Link>
          <Link href="/market" data-testid="link-market" className="text-[13px] text-navy hover:text-brand">云服务市场</Link>
          <Link href="/console/messages" className="relative text-[13px] text-navy" aria-label="消息">
            消息
            {state.messages.some((item) => item.unread) ? <i className="absolute -right-2 -top-1 h-1.5 w-1.5 rounded-full bg-brand" /> : null}
          </Link>
          <select aria-label="切换身份" className="h-8 rounded-md border border-line bg-white px-2 text-[12px]" value={state.role} onChange={(event) => setRole(event.target.value as RoleId)}>
            {(Object.keys(roleMeta) as RoleId[]).map((role) => <option key={role} value={role}>{roleMeta[role].label}</option>)}
          </select>
          <div className="text-right leading-tight">
            <div className="text-[13px] font-medium text-navy">{roleMeta[state.role].person}</div>
            <div className="text-[11px] text-muted">{roleMeta[state.role].org}</div>
          </div>
          <button type="button" className="text-[12px] text-muted" onClick={() => { logout(); router.push("/"); }}>退出</button>
          <button type="button" className="text-[12px] text-muted" onClick={resetDemo}>重置演示</button>
        </header>
        <main className="flex-1 px-6 py-5">{children}</main>
      </div>
      {state.toasts[0] ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-navy px-4 py-3 text-[13px] text-white shadow-lg">{state.toasts[0].text}</div>
      ) : null}
    </div>
  );
}

export function ScreenChrome({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();
  const screens = [
    { href: "/screens/resource", label: "资源使用情况" },
    { href: "/screens/cost", label: "费用统计分析" },
    { href: "/screens/traffic", label: "流量分析" },
    { href: "/screens/storage", label: "存储分析" },
  ];
  return (
    <div className="min-h-screen bg-[#071422] text-white">
      <header className="flex h-14 items-center gap-4 border-b border-white/10 px-5">
        <span className="grid h-7 w-7 place-items-center bg-brand text-[13px] font-semibold">每</span>
        <div>
          <div className="text-[12px] text-white/50">每经云</div>
          <h1 className="text-[16px] font-semibold leading-none">{title}</h1>
        </div>
        <nav className="ml-4 flex gap-1">
          {screens.map((screen) => (
            <Link key={screen.href} href={screen.href} data-testid={`screen-${screen.href.split("/").pop()}`} className={`rounded px-2.5 py-1 text-[13px] ${title === screen.label ? "bg-white/10" : "text-white/65 hover:text-white"}`}>
              {screen.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-[12px] text-white/60">
          <span>数据截至 2026-11-18 08:30</span>
          <button type="button" className="rounded border border-white/20 px-2 py-1 text-white" onClick={() => {
            if (!document.fullscreenElement) void document.documentElement.requestFullscreen();
            else void document.exitFullscreen();
          }}>全屏</button>
          <button type="button" className="text-white/80" onClick={() => router.push("/console/overview")}>返回控制台</button>
        </div>
      </header>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export function MarketChrome({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const pathname = usePathname();
  const cats = [
    { href: "/market", label: "首页" },
    { href: "/market/c/计算", label: "计算" },
    { href: "/market/c/存储", label: "存储" },
    { href: "/market/c/数据库", label: "数据库" },
    { href: "/market/c/中间件", label: "中间件" },
    { href: "/market/c/组合服务", label: "组合服务" },
  ];
  return (
    <div className="min-h-screen bg-[#F6F7F9] text-ink">
      <header className="border-b border-line bg-white">
        <div className="flex h-16 items-center gap-6 px-8">
          <Link href="/market" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center bg-brand text-[14px] font-semibold text-white">每</span>
            <span>
              <span className="block text-[16px] font-semibold leading-none text-navy">每经云服务市场</span>
              <span className="mt-1 block text-[11px] text-muted">目录 · 申请 · 审批 · 计量</span>
            </span>
          </Link>
          <nav className="flex gap-4 text-[14px]">
            {cats.map((cat) => (
              <Link key={cat.href} href={cat.href} className={pathname === cat.href ? "text-brand" : "text-navy"}>{cat.label}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4 text-[13px]">
            <Link href="/market/cart" data-testid="link-cart" className="text-navy">购物车 {state.cart.length > 0 ? `(${state.cart.length})` : ""}</Link>
            <Link href="/market/applications" className="text-navy">我的申请</Link>
            <Link href="/console/overview" className="text-muted">返回控制台</Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1180px] px-6 py-6">{children}</div>
    </div>
  );
}

export function phaseHint() {
  return <PhaseTag phase="二期开放" />;
}
