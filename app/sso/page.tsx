"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

const steps = [
  { n: "1", title: "访问平台", desc: "未登录访问将引导至集团统一认证。" },
  { n: "2", title: "携带 OAuth 2.0 参数", desc: "授权码模式，范围 openid、profile、org。" },
  { n: "3", title: "在身份源完成认证", desc: "口令与 MFA 留在集团统一认证，本页不采集。" },
  { n: "4", title: "回调并建立会话", desc: "校验签名、时效与受众后映射平台角色。" },
];

export default function SsoPage() {
  const { login } = useApp();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-canvas px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-navy">
          <span className="grid h-8 w-8 place-items-center bg-brand text-[14px] font-semibold text-white">每</span>
          <span className="text-[15px] font-semibold">每经云 · 统一认证确认</span>
        </div>
        <h1 className="mt-8 text-[28px] font-semibold text-navy">集团统一认证</h1>
        <p className="mt-2 text-[14px] text-muted">示意 OAuth 2.0 授权码流程。不会连接真实身份源，也不会保存口令。</p>
        <div className="mt-6 grid gap-4 rounded-lg border border-line bg-white p-5 text-[13px] md:grid-cols-2">
          <div><span className="text-muted">协议</span><div className="mt-1 text-navy">OAuth 2.0 授权码</div></div>
          <div><span className="text-muted">客户端</span><div className="mt-1 text-navy">每经云（下游应用）</div></div>
          <div><span className="text-muted">回调地址</span><div className="mt-1 text-navy">平台 /sso/callback</div></div>
          <div><span className="text-muted">身份</span><div className="mt-1 text-navy">周启明 · 集团云平台运营 · 平台管理员</div></div>
        </div>
        <ol className="mt-6 space-y-3">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-3 rounded-lg border border-line bg-white px-4 py-3">
              <span className="num text-[18px] font-semibold text-brand">{step.n}</span>
              <span>
                <span className="block text-[14px] font-medium text-navy">{step.title}</span>
                <span className="mt-1 block text-[13px] text-muted">{step.desc}</span>
              </span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          data-testid="sso-confirm"
          className="mt-6 h-11 rounded-md bg-brand px-6 text-[15px] font-medium text-white"
          onClick={() => { login(); router.push("/console/overview"); }}
        >
          确认授权并进入控制台
        </button>
        <p className="mt-4 text-[12px] text-muted">全局登出将随集团统一认证的登出回调使平台会话失效。此处仅演示登录。</p>
      </div>
    </div>
  );
}
