"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { products } from "@/lib/data";
import { useApp } from "@/lib/store";
import { DemoNote, Empty } from "@/components/ui";

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const category = decodeURIComponent(params.category);
  const { state } = useApp();
  const list = [...state.productsExtra, ...products].filter((item) => item.category === category);
  if (list.length === 0) return <Empty title="这个类目没有产品" desc="请返回市场首页查看在售套餐。" />;
  return (
    <div>
      <h1 className="text-[24px] font-semibold text-navy">{category}</h1>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {list.map((product) => (
          <Link key={product.id} href={`/market/p/${product.id}`} data-testid={`product-${product.id}`} className="rounded-lg border border-line bg-white p-4">
            <div className="text-[18px] font-semibold text-navy">{product.name}</div>
            <p className="mt-2 text-[13px] leading-6 text-muted">{product.summary}</p>
            <div className="num mt-3 text-[16px]">¥{product.specs[0]?.monthly.toLocaleString("zh-CN")} 起 / 月</div>
          </Link>
        ))}
      </div>
      <DemoNote />
    </div>
  );
}
