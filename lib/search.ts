import { databases, networks, products, storages, vms } from "@/lib/data";
import type { AppState } from "@/lib/store";

export type SearchHit = { type: string; title: string; href: string; hint: string };

export function searchAll(state: AppState, q: string): SearchHit[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const hits: SearchHit[] = [];
  const hit = (type: string, title: string, href: string, hint: string) => {
    if (`${title} ${hint} ${href}`.toLowerCase().includes(query)) hits.push({ type, title, href, hint });
  };
  vms.forEach((vm) => hit("虚拟机", vm.name, `/console/compute/${vm.id}`, `${vm.privateIp} ${vm.os}`));
  state.accounts.forEach((account) => hit("云账号", account.name, `/console/accounts/${account.id}`, account.cloudId));
  state.tickets.forEach((ticket) => hit("工单", `${ticket.no} ${ticket.title}`, `/console/tickets/${ticket.id}`, ticket.type));
  networks.forEach((item) => hit(item.kind, item.name, `/console/network/${item.id}`, item.summary));
  storages.forEach((item) => hit(item.kind, item.name, `/console/storage/${item.id}`, item.size));
  databases.forEach((item) => hit(item.engine, item.name, `/console/database/${item.id}`, item.spec));
  [...products, ...state.productsExtra].forEach((item) => hit("市场产品", item.name, `/market/p/${item.id}`, item.category));
  state.applications.forEach((item) => hit("申请", item.id, `/market/applications/${item.id}`, item.title));
  return hits;
}
