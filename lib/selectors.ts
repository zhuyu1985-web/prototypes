import { costFacts } from "@/lib/data";
import type { AppState } from "@/lib/store";
import type { CostFact, DomainId, ProjectId } from "@/lib/types";

export function inScope(state: AppState, domainId: string, projectId?: string): boolean {
  if (state.view === "admin") return true;
  if (state.view === "domain") return domainId === state.domainId;
  return Boolean(projectId) && projectId === state.projectId;
}

export function scopedFacts(state: AppState, facts: CostFact[] = costFacts): CostFact[] {
  return facts.filter((fact) => inScope(state, fact.domainId, fact.projectId));
}

export function sumBy<T extends string>(rows: { key: T; amount: number }[]): { key: T; amount: number }[] {
  const map = new Map<T, number>();
  rows.forEach((row) => map.set(row.key, (map.get(row.key) ?? 0) + row.amount));
  return [...map.entries()]
    .map(([key, amount]) => ({ key, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function projectsOf(domainId: DomainId): ProjectId[] {
  if (domainId === "fusion") return ["fusion-platform", "fusion-cms"];
  if (domainId === "tech") return ["tech-platform", "tech-data"];
  if (domainId === "media") return ["media-site"];
  return ["fin-core"];
}
