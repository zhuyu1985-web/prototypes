"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

const points = ["统一管理", "统一调度", "统一运营", "统一服务"];

export default function LoginPage() {
  const { state, ready } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (ready && state.authed) router.replace("/console/overview");
  }, [ready, state.authed, router]);

  return (
    <div className="grid min-h-screen grid-cols-[1.1fr_0.9fr] bg-white">
      <section className="flex flex-col justify-between bg-navy px-14 py-12 text-white">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-brand text-[18px] font-semibold">每</span>
          <span className="text-[20px] font-semibold">每经云</span>
        </div>
        <div>
          <p className="text-[13px] tracking-[0.2em] text-white/55">集团云上之云</p>
          <h1 className="mt-4 max-w-xl text-[40px] font-semibold leading-tight">统一管理 · 统一调度<br />统一运营 · 统一服务</h1>
          <p className="mt-6 max-w-lg text-[15px] leading-7 text-white/75">
            把分散在 6 家公有云与 2 家专属云上的计算、存储、网络和数据库收成一个管理平面。一期先把家底看清、费用算准、流程管住。
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
            {points.map((point) => (
              <div key={point} className="border border-white/15 px-4 py-3 text-[14px]">{point}</div>
            ))}
          </div>
        </div>
        <p className="text-[12px] text-white/45">下游应用接入集团统一认证 · OAuth 2.0 · 示意环境</p>
      </section>
      <section className="flex items-center justify-center px-10">
        <div className="w-full max-w-md">
          <h2 className="text-[24px] font-semibold text-navy">进入每经云</h2>
          <p className="mt-3 text-[14px] leading-7 text-muted">
            本平台不提供本地口令登录。请使用集团统一认证。认证完成后，账号与组织从身份源同步，权限在平台侧映射。
          </p>
          <button
            type="button"
            data-testid="login-sso"
            className="mt-8 h-11 w-full rounded-md bg-brand text-[15px] font-medium text-white"
            onClick={() => router.push("/sso")}
          >
            集团统一认证登录
          </button>
          <p className="mt-4 text-[12px] leading-6 text-muted">
            应急维护账号仅保留最小权限并纳入审计，不在本次演示中开放。OIDC、SAML、CAS、LDAP 为后续协议储备。
          </p>
        </div>
      </section>
    </div>
  );
}
