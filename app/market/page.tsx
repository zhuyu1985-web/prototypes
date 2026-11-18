"use client";

import Link from "next/link";
import { products } from "@/lib/data";
import { useApp } from "@/lib/store";
import { DemoNote } from "@/components/ui";

const cats = [
  { href: "/market/c/计算", name: "计算", desc: "通用与内存型套餐" },
  { href: "/market/c/存储", name: "存储", desc: "标准对象存储" },
  { href: "/market/c/数据库", name: "数据库", desc: "MySQL 主备" },
  { href: "/market/c/中间件", name: "中间件", desc: "Redis 缓存" },
  { href: "/market/c/组合服务", name: "组合服务", desc: "一次审批多项资源" },
];

export default function MarketHome() {
  const { state } = useApp();
  const list = [...state.productsExtra, ...products];
  return (
    <div>
      <section className="rounded-lg bg-navy px-8 py-8 text-white">
        <p className="text-[12px] tracking-[0.18em] text-white/55">每经云服务市场</p>
        <h1 className="mt-2 text-[32px] font-semibold">按套餐申请云资源</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/75">浏览目录、配置规格和归属项目，提交后进入配额校验与审批。一期通过后转工单交付，不在本平台自动开通。</p>
      </section>
      <div className="mt-5 grid grid-cols-5 gap-3">
        {cats.map((cat) => (
          <Link key={cat.href} href={cat.href} className="rounded-lg border border-line bg-white p-4 hover:border-navy">
            <div className="text-[16px] font-medium text-navy">{cat.name}</div>
            <p className="mt-1 text-[12px] text-muted">{cat.desc}</p>
          </Link>
        ))}
      </div>
      <h2 className="mb-3 mt-8 text-[18px] font-semibold text-navy">在售套餐</h2>
      <div className="grid grid-cols-3 gap-3">
        {list.map((product) => (
          <Link key={product.id} href={`/market/p/${product.id}`} data-testid={`product-${product.id}`} className="rounded-lg border border-line bg-white p-4 hover:border-navy">
            <div className="text-[12px] text-muted">{product.category} · {product.visibility}</div>
            <div className="mt-1 text-[18px] font-semibold text-navy">{product.name}</div>
            <p className="mt-2 text-[13px] leading-6 text-muted">{product.summary}</p>
            <div className="num mt-4 text-[18px] text-navy">¥{product.specs[0]?.monthly.toLocaleString("zh-CN")} 起 / 月</div>
          </Link>
        ))}
      </div>
      <DemoNote>价格为平台套餐价。</DemoNote>
    </div>
  );
}
