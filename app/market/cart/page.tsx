"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { products, projectName } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Button, DemoNote, Empty } from "@/components/ui";

export default function CartPage() {
  const { state, removeCart, submitCart } = useApp();
  const router = useRouter();
  const catalog = [...products, ...state.productsExtra];
  if (state.cart.length === 0) {
    return <Empty title="购物车是空的" desc="从计算类目打开通用计算型，配置后即可加入。" />;
  }
  return (
    <div>
      <h1 className="text-[24px] font-semibold text-navy">购物车</h1>
      <div className="mt-4 space-y-3">
        {state.cart.map((line) => {
          const product = catalog.find((item) => item.id === line.productId);
          const spec = product?.specs.find((item) => item.id === line.specId);
          return (
            <div key={line.lineId} className="flex items-center justify-between rounded-lg border border-line bg-white p-4">
              <div>
                <div className="text-[16px] font-medium text-navy">{product?.name}</div>
                <div className="mt-1 text-[13px] text-muted">{spec?.name} · {line.cycle}{line.cycle === "包月" ? ` × ${line.months} 个月` : ""} · 数量 {line.qty} · {projectName(line.projectId)}</div>
              </div>
              <button type="button" className="text-[13px] text-muted" onClick={() => removeCart(line.lineId)}>移除</button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-3">
        <Button data-testid="btn-submit-apply" tone="brand" onClick={() => { submitCart(); router.push("/market/applications"); }}>提交申请</Button>
        <Link href="/market" className="self-center text-[13px] text-muted">继续浏览</Link>
      </div>
      <DemoNote />
    </div>
  );
}
