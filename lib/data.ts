import type {
  AiAllocation,
  AiAuditRow,
  AiModel,
  AlertItem,
  AlertPolicy,
  Anomaly,
  Application,
  AuditEvent,
  Budget,
  Channel,
  Cloud,
  CloudAccount,
  CompareRow,
  CostFact,
  DbItem,
  Domain,
  ExpiringResource,
  Job,
  NetItem,
  Optimization,
  Product,
  Project,
  QuotaRow,
  ReportDoc,
  RouteRule,
  SecurityFinding,
  StorageItem,
  Ticket,
  VirtualKey,
  Vm,
  AppMessage,
} from "@/lib/types";

export const clouds: Cloud[] = [
  { id: "aliyun", name: "阿里云", kind: "公有云" },
  { id: "huawei", name: "华为云", kind: "公有云" },
  { id: "tencent", name: "腾讯云", kind: "公有云" },
  { id: "volc", name: "火山引擎", kind: "公有云" },
  { id: "cmcc", name: "移动云", kind: "公有云" },
  { id: "ctyun", name: "天翼云", kind: "公有云" },
  { id: "cmcc-ded", name: "移动云专属云", kind: "专属云" },
  { id: "ctyun-ded", name: "天翼云专属云", kind: "专属云" },
];

export const domains: Domain[] = [
  { id: "tech", name: "技术中心" },
  { id: "media", name: "财经传媒" },
  { id: "fusion", name: "融媒云事业部" },
  { id: "finance", name: "财务共享中心" },
];

export const projects: Project[] = [
  { id: "fusion-platform", name: "融媒云平台", domainId: "fusion" },
  { id: "fusion-cms", name: "内容生产中台", domainId: "fusion" },
  { id: "tech-platform", name: "技术中台", domainId: "tech" },
  { id: "tech-data", name: "数据平台", domainId: "tech" },
  { id: "media-site", name: "财经网", domainId: "media" },
  { id: "fin-core", name: "核算核心", domainId: "finance" },
];

export function cloudById(id: string): Cloud | undefined {
  return clouds.find((item) => item.id === id);
}

export function domainById(id: string): Domain | undefined {
  return domains.find((item) => item.id === id);
}

export function projectById(id: string): Project | undefined {
  return projects.find((item) => item.id === id);
}

export function cloudName(id: string): string {
  return cloudById(id)?.name ?? id;
}

export function domainName(id: string): string {
  return domainById(id)?.name ?? id;
}

export function projectName(id: string): string {
  return projectById(id)?.name ?? id;
}

export const presetRoles: { name: string; group: string; summary: string }[] = [
  { name: "平台管理员", group: "平台", summary: "集团级全量管理、云账号接入与市场运营" },
  { name: "运维管理员", group: "三员", summary: "运维操作与变更。一期写操作保持关闭" },
  { name: "安全管理员", group: "三员", summary: "安全策略、配置检查与密钥治理" },
  { name: "审计管理员", group: "三员", summary: "操作与调用审计只读，可筛选追溯" },
  { name: "域管理员", group: "域", summary: "部门域内资源、审批、配额与告警" },
  { name: "域运维", group: "域", summary: "域内资源运维。一期以只读台账为主" },
  { name: "域安全", group: "域", summary: "域内安全检查与整改跟踪" },
  { name: "域审计", group: "域", summary: "域内审计只读" },
  { name: "项目所有者", group: "项目", summary: "项目资源、市场申请与虚拟 API Key" },
  { name: "项目编辑者", group: "项目", summary: "项目内配置。直接变更于二期开放" },
  { name: "项目查看者", group: "项目", summary: "项目资源与费用只读" },
  { name: "财务", group: "费用", summary: "账单、预算、分摊、报表与大屏" },
  { name: "费用查看者", group: "费用", summary: "费用数据只读" },
  { name: "市场运营", group: "市场", summary: "产品上架、可见范围与套餐定价" },
  { name: "工单处理人", group: "流程", summary: "工单流转、批注与交付登记" },
  { name: "监控值班", group: "流程", summary: "告警确认、屏蔽与渠道核验" },
  { name: "只读观察员", group: "平台", summary: "全局只读，用于管理层查阅" },
];

export const members: { name: string; role: string; org: string; source: string }[] = [
  { name: "周启明", role: "平台管理员", org: "集团云平台运营", source: "统一认证同步" },
  { name: "林知夏", role: "域管理员", org: "融媒云事业部", source: "统一认证同步" },
  { name: "陈予安", role: "项目所有者", org: "融媒云平台", source: "统一认证同步" },
  { name: "沈清和", role: "业务用户", org: "内容生产中台", source: "统一认证同步" },
  { name: "顾衡", role: "财务", org: "财务共享中心", source: "统一认证同步" },
  { name: "赵澜", role: "安全管理员", org: "技术中心", source: "统一认证同步" },
  { name: "许承志", role: "审计管理员", org: "集团", source: "统一认证同步" },
  { name: "马昭", role: "运维管理员", org: "技术中心", source: "统一认证同步" },
];

export const initialAccounts: CloudAccount[] = [
  {
    id: "acc-ali",
    name: "阿里云-集团生产",
    cloudId: "aliyun",
    domainId: "fusion",
    health: "正常",
    lastSync: "2026-11-18 08:12",
    balance: 186420,
    balanceThreshold: 50000,
    discountLabel: "账号优惠 92 折参与核算",
    access: "只读",
    regions: ["华东1（杭州）", "华北2（北京）"],
    billCollect: "月账单 + 资源级流水",
    syncCron: "每 30 分钟",
  },
  {
    id: "acc-hw",
    name: "华为云-财经传媒",
    cloudId: "huawei",
    domainId: "media",
    health: "正常",
    lastSync: "2026-11-18 08:06",
    balance: 94210,
    balanceThreshold: 30000,
    discountLabel: "无额外优惠",
    access: "只读",
    regions: ["华东-上海一"],
    billCollect: "月账单 + 资源级流水",
    syncCron: "每 30 分钟",
  },
  {
    id: "acc-tx",
    name: "腾讯云-技术中心",
    cloudId: "tencent",
    domainId: "tech",
    health: "正常",
    lastSync: "2026-11-18 07:58",
    balance: 120440,
    balanceThreshold: 40000,
    discountLabel: "无额外优惠",
    access: "只读",
    regions: ["上海"],
    billCollect: "月账单 + 资源级流水",
    syncCron: "每 30 分钟",
  },
  {
    id: "acc-volc",
    name: "火山引擎-融媒实验",
    cloudId: "volc",
    domainId: "fusion",
    health: "正常",
    lastSync: "2026-11-18 07:40",
    balance: 28600,
    balanceThreshold: 30000,
    discountLabel: "无额外优惠",
    access: "只读",
    regions: ["华北2（北京）"],
    billCollect: "月账单",
    syncCron: "每 1 小时",
  },
  {
    id: "acc-cmcc",
    name: "移动云-集团办公",
    cloudId: "cmcc",
    domainId: "tech",
    health: "正常",
    lastSync: "2026-11-18 08:01",
    balance: 67320,
    balanceThreshold: 20000,
    discountLabel: "无额外优惠",
    access: "只读",
    regions: ["华东-苏州"],
    billCollect: "月账单 + 资源级流水",
    syncCron: "每 30 分钟",
  },
  {
    id: "acc-ct",
    name: "天翼云-融媒分发",
    cloudId: "ctyun",
    domainId: "fusion",
    health: "凭据将过期",
    lastSync: "2026-11-18 06:22",
    balance: 41880,
    balanceThreshold: 20000,
    discountLabel: "无额外优惠",
    access: "只读",
    regions: ["华东-杭州"],
    billCollect: "月账单",
    syncCron: "每 30 分钟",
  },
  {
    id: "acc-cmcc-ded",
    name: "移动云专属云-内容生产",
    cloudId: "cmcc-ded",
    domainId: "fusion",
    health: "正常",
    lastSync: "2026-11-18 08:10",
    balance: null,
    balanceThreshold: null,
    discountLabel: "资源池核算",
    access: "只读",
    regions: ["专属云-成都"],
    billCollect: "资源池计量",
    syncCron: "每 30 分钟",
  },
  {
    id: "acc-ct-ded",
    name: "天翼云专属云-财务专区",
    cloudId: "ctyun-ded",
    domainId: "finance",
    health: "同步延迟",
    lastSync: "2026-11-17 22:16",
    balance: null,
    balanceThreshold: null,
    discountLabel: "资源池核算",
    access: "只读",
    regions: ["专属云-上海"],
    billCollect: "资源池计量",
    syncCron: "每 30 分钟",
  },
];

export const vms: Vm[] = [
  { id: "rm-web-01", name: "rm-web-01", cloudId: "aliyun", accountId: "acc-ali", region: "华东1（杭州）", domainId: "fusion", projectId: "fusion-platform", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 200, os: "Alibaba Cloud Linux 3", privateIp: "10.8.1.11", publicIp: "47.98.12.21", tags: ["env=prod", "app=portal"], cpuAvg: 62, memAvg: 71, createdAt: "2025-04-12" },
  { id: "rm-web-02", name: "rm-web-02", cloudId: "aliyun", accountId: "acc-ali", region: "华东1（杭州）", domainId: "fusion", projectId: "fusion-platform", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 200, os: "Alibaba Cloud Linux 3", privateIp: "10.8.1.12", publicIp: "47.98.12.22", tags: ["env=prod", "app=portal"], cpuAvg: 48, memAvg: 66, createdAt: "2025-04-12" },
  { id: "rm-api-01", name: "rm-api-01", cloudId: "aliyun", accountId: "acc-ali", region: "华东1（杭州）", domainId: "fusion", projectId: "fusion-platform", status: "运行中", cpu: 8, memoryGb: 16, diskGb: 300, os: "Alibaba Cloud Linux 3", privateIp: "10.8.2.21", tags: ["env=prod", "app=api"], cpuAvg: 55, memAvg: 63, createdAt: "2025-06-03" },
  { id: "rm-api-02", name: "rm-api-02", cloudId: "aliyun", accountId: "acc-ali", region: "华东1（杭州）", domainId: "fusion", projectId: "fusion-cms", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 200, os: "openEuler 22.03", privateIp: "10.9.2.14", tags: ["env=prod", "app=cms-api"], cpuAvg: 33, memAvg: 48, createdAt: "2025-08-19" },
  { id: "rm-worker-01", name: "rm-worker-01", cloudId: "aliyun", accountId: "acc-ali", region: "华东1（杭州）", domainId: "fusion", projectId: "fusion-cms", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 200, os: "openEuler 22.03", privateIp: "10.9.3.8", tags: ["env=prod", "app=worker"], cpuAvg: 4.2, memAvg: 11, createdAt: "2025-09-02", lowLoad: true },
  { id: "rm-worker-02", name: "rm-worker-02", cloudId: "aliyun", accountId: "acc-ali", region: "华东1（杭州）", domainId: "fusion", projectId: "fusion-cms", status: "已停止", cpu: 2, memoryGb: 4, diskGb: 100, os: "openEuler 22.03", privateIp: "10.9.3.9", tags: ["env=prod", "app=worker"], cpuAvg: 0, memAvg: 0, createdAt: "2025-09-02" },
  { id: "rm-search-01", name: "rm-search-01", cloudId: "huawei", accountId: "acc-hw", region: "华东-上海一", domainId: "fusion", projectId: "fusion-platform", status: "运行中", cpu: 8, memoryGb: 16, diskGb: 500, os: "Huawei Cloud EulerOS", privateIp: "10.16.1.20", tags: ["env=prod", "app=search"], cpuAvg: 41, memAvg: 58, createdAt: "2025-05-21" },
  { id: "media-web-01", name: "media-web-01", cloudId: "huawei", accountId: "acc-hw", region: "华东-上海一", domainId: "media", projectId: "media-site", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 200, os: "Huawei Cloud EulerOS", privateIp: "10.16.8.11", publicIp: "139.9.44.10", tags: ["env=prod", "app=site"], cpuAvg: 37, memAvg: 52, createdAt: "2024-11-08" },
  { id: "media-web-02", name: "media-web-02", cloudId: "huawei", accountId: "acc-hw", region: "华东-上海一", domainId: "media", projectId: "media-site", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 200, os: "Huawei Cloud EulerOS", privateIp: "10.16.8.12", publicIp: "139.9.44.11", tags: ["env=prod", "app=site"], cpuAvg: 29, memAvg: 49, createdAt: "2024-11-08" },
  { id: "media-cms-01", name: "media-cms-01", cloudId: "huawei", accountId: "acc-hw", region: "华东-上海一", domainId: "media", projectId: "media-site", status: "同步异常", cpu: 4, memoryGb: 8, diskGb: 200, os: "Huawei Cloud EulerOS", privateIp: "10.16.8.30", tags: ["env=prod", "app=cms"], cpuAvg: 0, memAvg: 0, createdAt: "2025-02-14" },
  { id: "tech-gw-01", name: "tech-gw-01", cloudId: "tencent", accountId: "acc-tx", region: "上海", domainId: "tech", projectId: "tech-platform", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 150, os: "TencentOS Server 3", privateIp: "10.32.1.5", publicIp: "129.211.8.16", tags: ["env=prod", "app=gateway"], cpuAvg: 22, memAvg: 40, createdAt: "2025-01-09" },
  { id: "tech-gw-02", name: "tech-gw-02", cloudId: "tencent", accountId: "acc-tx", region: "上海", domainId: "tech", projectId: "tech-platform", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 150, os: "TencentOS Server 3", privateIp: "10.32.1.6", tags: ["env=prod", "app=gateway"], cpuAvg: 25, memAvg: 44, createdAt: "2025-01-09" },
  { id: "tech-data-01", name: "tech-data-01", cloudId: "tencent", accountId: "acc-tx", region: "上海", domainId: "tech", projectId: "tech-data", status: "运行中", cpu: 16, memoryGb: 32, diskGb: 1000, os: "TencentOS Server 3", privateIp: "10.33.2.10", tags: ["env=prod", "app=warehouse"], cpuAvg: 71, memAvg: 77, createdAt: "2025-03-28" },
  { id: "tech-data-02", name: "tech-data-02", cloudId: "tencent", accountId: "acc-tx", region: "上海", domainId: "tech", projectId: "tech-data", status: "已停止", cpu: 8, memoryGb: 16, diskGb: 500, os: "TencentOS Server 3", privateIp: "10.33.2.11", tags: ["env=stage", "app=warehouse"], cpuAvg: 0, memAvg: 0, createdAt: "2025-03-28" },
  { id: "volc-lab-01", name: "volc-lab-01", cloudId: "volc", accountId: "acc-volc", region: "华北2（北京）", domainId: "fusion", projectId: "fusion-platform", status: "运行中", cpu: 2, memoryGb: 4, diskGb: 80, os: "veLinux", privateIp: "10.40.1.15", tags: ["env=lab", "app=model-eval"], cpuAvg: 12, memAvg: 28, createdAt: "2026-02-11" },
  { id: "cmcc-oa-01", name: "cmcc-oa-01", cloudId: "cmcc", accountId: "acc-cmcc", region: "华东-苏州", domainId: "tech", projectId: "tech-platform", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 200, os: "Kylin Linux Advanced Server", privateIp: "10.48.1.21", tags: ["env=prod", "app=oa-edge"], cpuAvg: 18, memAvg: 36, createdAt: "2025-07-01" },
  { id: "cmcc-oa-02", name: "cmcc-oa-02", cloudId: "cmcc", accountId: "acc-cmcc", region: "华东-苏州", domainId: "tech", projectId: "tech-platform", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 200, os: "Kylin Linux Advanced Server", privateIp: "10.48.1.22", tags: ["env=prod", "app=oa-edge"], cpuAvg: 16, memAvg: 34, createdAt: "2025-07-01" },
  { id: "ct-cdn-01", name: "ct-cdn-01", cloudId: "ctyun", accountId: "acc-ct", region: "华东-杭州", domainId: "fusion", projectId: "fusion-platform", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 200, os: "CTyunOS", privateIp: "10.24.1.7", publicIp: "123.60.18.30", tags: ["env=prod", "app=origin"], cpuAvg: 44, memAvg: 51, createdAt: "2025-10-16" },
  { id: "ct-cdn-02", name: "ct-cdn-02", cloudId: "ctyun", accountId: "acc-ct", region: "华东-杭州", domainId: "fusion", projectId: "fusion-cms", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 200, os: "CTyunOS", privateIp: "10.24.1.8", tags: ["env=prod", "app=origin"], cpuAvg: 36, memAvg: 47, createdAt: "2025-10-16" },
  { id: "ded-edit-01", name: "ded-edit-01", cloudId: "cmcc-ded", accountId: "acc-cmcc-ded", region: "专属云-成都", domainId: "fusion", projectId: "fusion-cms", status: "运行中", cpu: 8, memoryGb: 32, diskGb: 800, os: "openEuler 22.03", privateIp: "10.70.2.11", tags: ["env=prod", "app=nle"], cpuAvg: 58, memAvg: 64, createdAt: "2025-12-04" },
  { id: "ded-edit-02", name: "ded-edit-02", cloudId: "cmcc-ded", accountId: "acc-cmcc-ded", region: "专属云-成都", domainId: "fusion", projectId: "fusion-cms", status: "运行中", cpu: 8, memoryGb: 32, diskGb: 800, os: "openEuler 22.03", privateIp: "10.70.2.12", tags: ["env=prod", "app=nle"], cpuAvg: 51, memAvg: 60, createdAt: "2025-12-04" },
  { id: "ded-render-01", name: "ded-render-01", cloudId: "cmcc-ded", accountId: "acc-cmcc-ded", region: "专属云-成都", domainId: "fusion", projectId: "fusion-cms", status: "运行中", cpu: 16, memoryGb: 64, diskGb: 2000, os: "openEuler 22.03", privateIp: "10.70.4.3", tags: ["env=prod", "app=render"], cpuAvg: 6.1, memAvg: 9, createdAt: "2026-01-20", lowLoad: true },
  { id: "fin-app-01", name: "fin-app-01", cloudId: "ctyun-ded", accountId: "acc-ct-ded", region: "专属云-上海", domainId: "finance", projectId: "fin-core", status: "运行中", cpu: 4, memoryGb: 8, diskGb: 300, os: "Kylin Linux Advanced Server", privateIp: "10.64.1.8", tags: ["env=prod", "app=ledger"], cpuAvg: 27, memAvg: 46, createdAt: "2024-09-18" },
  { id: "fin-app-02", name: "fin-app-02", cloudId: "ctyun-ded", accountId: "acc-ct-ded", region: "专属云-上海", domainId: "finance", projectId: "fin-core", status: "同步异常", cpu: 4, memoryGb: 16, diskGb: 500, os: "Kylin Linux Advanced Server", privateIp: "10.64.1.9", tags: ["env=prod", "app=ledger"], cpuAvg: 0, memAvg: 0, createdAt: "2024-09-18" },
];

export const networks: NetItem[] = [
  { id: "vpc-rm-prod", kind: "VPC", name: "vpc-rm-prod", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", region: "华东1（杭州）", status: "可用", summary: "融媒云生产专有网络", cidr: "10.8.0.0/16" },
  { id: "vpc-rm-cms", kind: "VPC", name: "vpc-rm-cms", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-cms", region: "华东1（杭州）", status: "可用", summary: "内容生产专有网络", cidr: "10.9.0.0/16" },
  { id: "vpc-media", kind: "VPC", name: "vpc-media", cloudId: "huawei", domainId: "media", projectId: "media-site", region: "华东-上海一", status: "可用", summary: "财经网业务网络", cidr: "10.16.0.0/16" },
  { id: "vpc-tech", kind: "VPC", name: "vpc-tech", cloudId: "tencent", domainId: "tech", projectId: "tech-platform", region: "上海", status: "可用", summary: "技术中台网络", cidr: "10.32.0.0/16" },
  { id: "vpc-fin", kind: "VPC", name: "vpc-fin", cloudId: "ctyun-ded", domainId: "finance", projectId: "fin-core", region: "专属云-上海", status: "可用", summary: "财务专区隔离网络", cidr: "10.64.0.0/16" },
  { id: "subnet-rm-web", kind: "子网", name: "subnet-rm-web", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", region: "华东1（杭州）", status: "可用", summary: "门户子网，隶属 vpc-rm-prod", cidr: "10.8.1.0/24" },
  { id: "subnet-cms-worker", kind: "子网", name: "subnet-cms-worker", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-cms", region: "华东1（杭州）", status: "可用", summary: "转码与任务子网", cidr: "10.9.3.0/24" },
  { id: "sg-rm-web", kind: "安全组", name: "sg-rm-web", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", region: "华东1（杭州）", status: "使用中", summary: "门户入向规则", risk: "安全组全开放", rules: [
    { dir: "入向", proto: "TCP", port: "22", source: "0.0.0.0/0", action: "允许" },
    { dir: "入向", proto: "TCP", port: "80", source: "0.0.0.0/0", action: "允许" },
    { dir: "入向", proto: "TCP", port: "443", source: "0.0.0.0/0", action: "允许" },
  ] },
  { id: "sg-rm-app", kind: "安全组", name: "sg-rm-app", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", region: "华东1（杭州）", status: "使用中", summary: "应用层仅允许内网", rules: [
    { dir: "入向", proto: "TCP", port: "8080", source: "10.8.0.0/16", action: "允许" },
  ] },
  { id: "sg-fin", kind: "安全组", name: "sg-fin", cloudId: "ctyun-ded", domainId: "finance", projectId: "fin-core", region: "专属云-上海", status: "使用中", summary: "财务专区最小放通", rules: [
    { dir: "入向", proto: "TCP", port: "443", source: "10.64.0.0/16", action: "允许" },
  ] },
  { id: "eip-rm-web-01", kind: "EIP", name: "eip-rm-web-01", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", region: "华东1（杭州）", status: "已绑定", summary: "绑定 rm-web-01" },
  { id: "eip-rm-web-02", kind: "EIP", name: "eip-rm-web-02", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", region: "华东1（杭州）", status: "已绑定", summary: "绑定 rm-web-02" },
  { id: "eip-media", kind: "EIP", name: "eip-media-web", cloudId: "huawei", domainId: "media", projectId: "media-site", region: "华东-上海一", status: "已绑定", summary: "绑定 media-web-01" },
  { id: "eip-tech", kind: "EIP", name: "eip-tech-gw", cloudId: "tencent", domainId: "tech", projectId: "tech-platform", region: "上海", status: "已绑定", summary: "绑定 tech-gw-01" },
  { id: "eip-volc-idle", kind: "EIP", name: "eip-volc-idle", cloudId: "volc", domainId: "fusion", projectId: "fusion-platform", region: "华北2（北京）", status: "未绑定", summary: "连续 21 天无绑定记录", risk: "闲置 EIP" },
  { id: "eip-ct-cdn", kind: "EIP", name: "eip-ct-cdn", cloudId: "ctyun", domainId: "fusion", projectId: "fusion-platform", region: "华东-杭州", status: "已绑定", summary: "绑定 ct-cdn-01" },
  { id: "nat-rm", kind: "NAT", name: "nat-rm-prod", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", region: "华东1（杭州）", status: "可用", summary: "生产 VPC 出网，SNAT 已配置" },
  { id: "nat-tech", kind: "NAT", name: "nat-tech", cloudId: "tencent", domainId: "tech", projectId: "tech-platform", region: "上海", status: "可用", summary: "技术中台共享出网" },
  { id: "dns-rm", kind: "DNS", name: "rm.internal", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", region: "华东1（杭州）", status: "正常", summary: "私有解析，12 条记录" },
  { id: "dns-fin", kind: "DNS", name: "fin.internal", cloudId: "ctyun-ded", domainId: "finance", projectId: "fin-core", region: "专属云-上海", status: "正常", summary: "财务专区私有解析" },
  { id: "lb-rm", kind: "负载均衡", name: "slb-rm-web", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", region: "华东1（杭州）", status: "运行中", summary: "门户 HTTPS 监听，后端 rm-web-01/02" },
  { id: "lb-media", kind: "负载均衡", name: "elb-media", cloudId: "huawei", domainId: "media", projectId: "media-site", region: "华东-上海一", status: "运行中", summary: "财经网站点负载均衡" },
];

export const storages: StorageItem[] = [
  { id: "oss-rm-media", kind: "对象存储", name: "oss-rm-media", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", size: "86 TB", status: "使用中", tier: "标准存储", acl: "私有" },
  { id: "oss-rm-public", kind: "对象存储", name: "oss-rm-public", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-cms", size: "1.2 TB", status: "使用中", tier: "标准存储", acl: "公共读写", risk: "对象存储公共读写" },
  { id: "obs-media-img", kind: "对象存储", name: "obs-media-img", cloudId: "huawei", domainId: "media", projectId: "media-site", size: "24 TB", status: "使用中", tier: "标准存储", acl: "私有" },
  { id: "cos-tech-log", kind: "对象存储", name: "cos-tech-log", cloudId: "tencent", domainId: "tech", projectId: "tech-platform", size: "9.4 TB", status: "使用中", tier: "低频访问", acl: "私有" },
  { id: "tos-volc-tmp", kind: "对象存储", name: "tos-volc-tmp", cloudId: "volc", domainId: "fusion", projectId: "fusion-platform", size: "640 GB", status: "使用中", tier: "标准存储", acl: "私有" },
  { id: "oss-fin-archive", kind: "对象存储", name: "oss-fin-archive", cloudId: "ctyun-ded", domainId: "finance", projectId: "fin-core", size: "18 TB", status: "使用中", tier: "归档存储", acl: "私有" },
  { id: "disk-rm-web-01", kind: "云盘", name: "disk-rm-web-01", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", size: "200 GB", status: "已挂载", tier: "ESSD", attachedTo: "rm-web-01" },
  { id: "disk-rm-api-01", kind: "云盘", name: "disk-rm-api-01", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", size: "300 GB", status: "已挂载", tier: "ESSD", attachedTo: "rm-api-01" },
  { id: "disk-data-01", kind: "云盘", name: "disk-data-01", cloudId: "tencent", domainId: "tech", projectId: "tech-data", size: "1000 GB", status: "已挂载", tier: "SSD", attachedTo: "tech-data-01" },
  { id: "disk-render-01", kind: "云盘", name: "disk-render-01", cloudId: "cmcc-ded", domainId: "fusion", projectId: "fusion-cms", size: "2000 GB", status: "已挂载", tier: "高性能", attachedTo: "ded-render-01" },
  { id: "disk-fin-01", kind: "云盘", name: "disk-fin-01", cloudId: "ctyun-ded", domainId: "finance", projectId: "fin-core", size: "500 GB", status: "已挂载", tier: "SSD", attachedTo: "fin-app-02" },
  { id: "disk-orphan-01", kind: "云盘", name: "disk-orphan-01", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-cms", size: "500 GB", status: "未挂载", tier: "ESSD", risk: "未挂载云盘" },
];

export const databases: DbItem[] = [
  { id: "rds-rm-main", engine: "RDS MySQL", name: "rds-rm-main", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", spec: "4核16GB · 500GB", status: "运行中", endpoint: "rm-main.mysql.internal:3306" },
  { id: "rds-media", engine: "RDS MySQL", name: "rds-media", cloudId: "huawei", domainId: "media", projectId: "media-site", spec: "4核16GB · 400GB", status: "运行中", endpoint: "media.mysql.internal:3306" },
  { id: "rds-fin", engine: "RDS PostgreSQL", name: "rds-fin", cloudId: "ctyun-ded", domainId: "finance", projectId: "fin-core", spec: "8核32GB · 1TB", status: "运行中", endpoint: "fin.pg.internal:5432" },
  { id: "redis-rm", engine: "Redis", name: "redis-rm", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", spec: "4GB 主从", status: "运行中", endpoint: "rm.redis.internal:6379" },
  { id: "redis-idle", engine: "Redis", name: "redis-idle", cloudId: "tencent", domainId: "tech", projectId: "tech-data", spec: "2GB 标准版", status: "空闲", endpoint: "idle.redis.internal:6379" },
  { id: "mongo-cms", engine: "MongoDB", name: "mongo-cms", cloudId: "aliyun", domainId: "fusion", projectId: "fusion-cms", spec: "4核8GB 副本集", status: "运行中", endpoint: "cms.mongo.internal:27017" },
  { id: "kafka-cms", engine: "Kafka", name: "kafka-cms", cloudId: "cmcc-ded", domainId: "fusion", projectId: "fusion-cms", spec: "3 节点 · 400MB/s", status: "运行中", endpoint: "cms.kafka.internal:9092" },
  { id: "es-search", engine: "Elasticsearch", name: "es-rm-search", cloudId: "huawei", domainId: "fusion", projectId: "fusion-platform", spec: "3 节点 · 16GB", status: "运行中", endpoint: "search.es.internal:9200" },
];

const rawFacts: Omit<CostFact, "yearAmount">[] = [
  { cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", resourceType: "计算", billingMode: "包月", amount: 480000 },
  { cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", resourceType: "数据库", billingMode: "包月", amount: 210000 },
  { cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", resourceType: "存储", billingMode: "按量", amount: 96000 },
  { cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", resourceType: "网络", billingMode: "按量", amount: 42000 },
  { cloudId: "aliyun", domainId: "fusion", projectId: "fusion-platform", resourceType: "AI 调用", billingMode: "按量", amount: 78400 },
  { cloudId: "huawei", domainId: "fusion", projectId: "fusion-platform", resourceType: "计算", billingMode: "包月", amount: 80000 },
  { cloudId: "cmcc-ded", domainId: "fusion", projectId: "fusion-cms", resourceType: "计算", billingMode: "包月", amount: 240000 },
  { cloudId: "cmcc-ded", domainId: "fusion", projectId: "fusion-cms", resourceType: "存储", billingMode: "按量", amount: 110000 },
  { cloudId: "cmcc-ded", domainId: "fusion", projectId: "fusion-cms", resourceType: "数据库", billingMode: "包月", amount: 62500 },
  { cloudId: "aliyun", domainId: "fusion", projectId: "fusion-cms", resourceType: "计算", billingMode: "按量", amount: 70000 },
  { cloudId: "ctyun", domainId: "fusion", projectId: "fusion-cms", resourceType: "网络", billingMode: "按量", amount: 55100 },
  { cloudId: "volc", domainId: "fusion", projectId: "fusion-cms", resourceType: "AI 调用", billingMode: "按量", amount: 100100 },
  { cloudId: "tencent", domainId: "tech", projectId: "tech-platform", resourceType: "计算", billingMode: "包月", amount: 300000 },
  { cloudId: "tencent", domainId: "tech", projectId: "tech-platform", resourceType: "网络", billingMode: "按量", amount: 48200 },
  { cloudId: "cmcc", domainId: "tech", projectId: "tech-platform", resourceType: "计算", billingMode: "包月", amount: 210000 },
  { cloudId: "cmcc", domainId: "tech", projectId: "tech-platform", resourceType: "存储", billingMode: "资源包", amount: 140000 },
  { cloudId: "huawei", domainId: "tech", projectId: "tech-platform", resourceType: "计算", billingMode: "包月", amount: 180000 },
  { cloudId: "tencent", domainId: "tech", projectId: "tech-data", resourceType: "数据库", billingMode: "包月", amount: 220000 },
  { cloudId: "tencent", domainId: "tech", projectId: "tech-data", resourceType: "存储", billingMode: "按量", amount: 50000 },
  { cloudId: "aliyun", domainId: "tech", projectId: "tech-data", resourceType: "计算", billingMode: "包月", amount: 250000 },
  { cloudId: "aliyun", domainId: "tech", projectId: "tech-data", resourceType: "其他", billingMode: "包月", amount: 100000 },
  { cloudId: "aliyun", domainId: "tech", projectId: "tech-data", resourceType: "AI 调用", billingMode: "按量", amount: 44600 },
  { cloudId: "huawei", domainId: "media", projectId: "media-site", resourceType: "计算", billingMode: "包月", amount: 320000 },
  { cloudId: "huawei", domainId: "media", projectId: "media-site", resourceType: "数据库", billingMode: "包月", amount: 186400 },
  { cloudId: "huawei", domainId: "media", projectId: "media-site", resourceType: "存储", billingMode: "按量", amount: 120000 },
  { cloudId: "huawei", domainId: "media", projectId: "media-site", resourceType: "网络", billingMode: "按量", amount: 60000 },
  { cloudId: "ctyun-ded", domainId: "finance", projectId: "fin-core", resourceType: "数据库", billingMode: "包月", amount: 180000 },
  { cloudId: "ctyun-ded", domainId: "finance", projectId: "fin-core", resourceType: "计算", billingMode: "包月", amount: 77300 },
  { cloudId: "ctyun", domainId: "finance", projectId: "fin-core", resourceType: "计算", billingMode: "包月", amount: 140000 },
  { cloudId: "ctyun", domainId: "finance", projectId: "fin-core", resourceType: "存储", billingMode: "按量", amount: 35900 },
];

export const costFacts: CostFact[] = rawFacts.map((fact, index) => ({
  ...fact,
  yearAmount: Math.round(fact.amount * (8.2 + (index % 5) * 0.15)),
}));

export const budgets: Budget[] = [
  { id: "b-fusion", level: "域", name: "融媒云事业部", refId: "fusion", period: "月", amount: 1800000, used: 1624100 },
  { id: "b-tech", level: "域", name: "技术中心", refId: "tech", period: "月", amount: 2000000, used: 1542800 },
  { id: "b-media", level: "域", name: "财经传媒", refId: "media", period: "月", amount: 800000, used: 686400 },
  { id: "b-fin", level: "域", name: "财务共享中心", refId: "finance", period: "月", amount: 500000, used: 433200 },
  { id: "b-fp", level: "项目", name: "融媒云平台", refId: "fusion-platform", period: "月", amount: 1200000, used: 986400 },
  { id: "b-cms", level: "项目", name: "内容生产中台", refId: "fusion-cms", period: "月", amount: 620000, used: 637700 },
  { id: "b-tp", level: "项目", name: "技术中台", refId: "tech-platform", period: "月", amount: 1100000, used: 878200 },
  { id: "b-td", level: "项目", name: "数据平台", refId: "tech-data", period: "月", amount: 900000, used: 664600 },
  { id: "b-ms", level: "项目", name: "财经网", refId: "media-site", period: "月", amount: 800000, used: 686400 },
  { id: "b-fc", level: "项目", name: "核算核心", refId: "fin-core", period: "月", amount: 520000, used: 433200 },
];

export const optimizations: Optimization[] = [
  {
    id: "opt-low-rm-worker",
    kind: "低负载虚拟机",
    title: "低负载虚拟机 rm-worker-01",
    resourceName: "rm-worker-01",
    href: "/console/compute/rm-worker-01",
    domainId: "fusion",
    projectId: "fusion-cms",
    saving: 1860,
    detail: "近 7 日 CPU 均值 4.2%，内存均值 11%，无定时任务依赖。当前规格 4核8GB，包月仍按整机计费。",
    suggestion: "建议降配至 2核4GB，或纳入工作时间外关机计划。关机与变配需在二期于本平台执行，一期请按既有渠道处理并回写工单。",
  },
  {
    id: "opt-low-render",
    kind: "低负载虚拟机",
    title: "低负载虚拟机 ded-render-01",
    resourceName: "ded-render-01",
    href: "/console/compute/ded-render-01",
    domainId: "fusion",
    projectId: "fusion-cms",
    saving: 2420,
    detail: "专属云渲染节点近 7 日 CPU 均值 6.1%，内存均值 9%。渲染队列夜间为空。",
    suggestion: "建议与内容生产确认是否改为按批次开机。定时开关机于二期开放，当前仅给出建议。",
  },
  {
    id: "opt-eip",
    kind: "闲置 EIP",
    title: "闲置弹性公网 IP eip-volc-idle",
    resourceName: "eip-volc-idle",
    href: "/console/network/eip-volc-idle",
    domainId: "fusion",
    projectId: "fusion-platform",
    saving: 380,
    detail: "火山引擎弹性公网 IP 连续 21 天未绑定实例，仍按保有计费。",
    suggestion: "确认实验环境不再使用后释放。绑定与释放操作于二期开放。",
  },
  {
    id: "opt-disk",
    kind: "未挂载云盘",
    title: "未挂载云盘 disk-orphan-01",
    resourceName: "disk-orphan-01",
    href: "/console/storage/disk-orphan-01",
    domainId: "fusion",
    projectId: "fusion-cms",
    saving: 640,
    detail: "阿里云 500GB ESSD 自 2026-10-02 起未挂载，无快照策略。",
    suggestion: "核对是否为下线任务残留盘。挂载、做快照或释放于二期开放。",
  },
  {
    id: "opt-redis",
    kind: "空闲 Redis",
    title: "空闲 Redis redis-idle",
    resourceName: "redis-idle",
    href: "/console/database/redis-idle",
    domainId: "tech",
    projectId: "tech-data",
    saving: 1120,
    detail: "近 14 日连接数为 0，无慢查询，无业务标签更新。",
    suggestion: "与数据平台确认后可退订。退订回收于二期开放，一期可登记工单跟踪。",
  },
];

export const anomalies: Anomaly[] = [
  { id: "an-1", title: "财经传媒日消费偏高", domainId: "media", projectId: "media-site", time: "2026-11-12", detail: "当日消费 ¥48,600，较近 7 日均值高 46%，主要来自华为云按量存储出流量。" },
  { id: "an-2", title: "内容生产中台预算超支", domainId: "fusion", projectId: "fusion-cms", time: "2026-11-18", detail: "11 月累计已超过项目月预算。对象存储按量与渲染规格是主要构成，新的包月申请将被拦截。" },
];

export const products: Product[] = [
  {
    id: "vm-general",
    name: "通用计算型",
    category: "计算",
    summary: "均衡的门户、接口与轻量任务规格，适合大多数业务系统。",
    detail: "基于已纳管云环境的标准化计算套餐。申请人选择规格、数量、周期和归属项目，提交后校验配额与预算。一期审批通过后转入工单，由云运营按既有渠道开通。",
    scene: "业务系统、内容接口、内部工具",
    visibility: "全集团可见",
    specs: [
      { id: "s2c4", name: "2核4GB", monthly: 186, usage: "按量 ¥0.46 / 时" },
      { id: "s4c8", name: "4核8GB", monthly: 428, usage: "按量 ¥0.98 / 时" },
      { id: "s8c16", name: "8核16GB", monthly: 796, usage: "按量 ¥1.82 / 时" },
    ],
  },
  {
    id: "vm-memory",
    name: "内存优化型",
    category: "计算",
    summary: "更高内存配比，用于缓存、检索与分析节点。",
    detail: "面向内存敏感型负载的平台套餐。不直接对应某一云厂商的零售规格名，交付时由运营映射到目标云的可用规格。",
    scene: "检索、缓存、数据分析",
    visibility: "全集团可见",
    specs: [
      { id: "m4c16", name: "4核16GB", monthly: 512, usage: "按量 ¥1.16 / 时" },
      { id: "m8c32", name: "8核32GB", monthly: 968, usage: "按量 ¥2.20 / 时" },
    ],
  },
  {
    id: "oss-std",
    name: "标准对象存储",
    category: "存储",
    summary: "热数据对象存储空间，按容量计量。",
    detail: "用于图片、成片和附件。权限默认私有。公共读写需要安全检查，不能通过本产品直接开放。",
    scene: "媒资、附件、静态资源",
    visibility: "全集团可见",
    specs: [{ id: "oss-1tb", name: "标准存储 1TB", monthly: 168, usage: "按量 ¥0.18 / GB·月" }],
  },
  {
    id: "rds-mysql",
    name: "云数据库 MySQL",
    category: "数据库",
    summary: "主备 MySQL，含自动备份与内网地址。",
    detail: "账号、白名单和备份策略的直接管理于二期开放。一期交付后在数据库台账中只读呈现。",
    scene: "业务主库",
    visibility: "全集团可见",
    specs: [
      { id: "db-2c4", name: "2核4GB · 200GB", monthly: 320, usage: "按量不提供" },
      { id: "db-4c8", name: "4核8GB · 400GB", monthly: 640, usage: "按量不提供" },
    ],
  },
  {
    id: "redis-std",
    name: "Redis 缓存",
    category: "中间件",
    summary: "标准版缓存，用于会话与热点数据。",
    detail: "与业务项目绑定。空闲实例会进入成本优化清单。",
    scene: "会话、热点缓存",
    visibility: "全集团可见",
    specs: [
      { id: "r-1", name: "1GB 主从", monthly: 86, usage: "按量不提供" },
      { id: "r-4", name: "4GB 主从", monthly: 246, usage: "按量不提供" },
    ],
  },
  {
    id: "bundle-cms",
    name: "融媒生产组合包",
    category: "组合服务",
    summary: "计算、对象存储与缓存的组合申请，一次审批。",
    detail: "包含通用计算 4核8GB ×2、标准对象存储 2TB、Redis 4GB。组合内资源仍分别入台账、分别计量。",
    scene: "新栏目快速起步",
    visibility: "融媒云事业部可见",
    specs: [{ id: "bundle-1", name: "标准组合", monthly: 1280, usage: "按组合包月" }],
  },
];

export const initialApplications: Application[] = [
  {
    id: "APP-2026-1102",
    title: "内存优化型 · 财经网检索扩容",
    productName: "内存优化型",
    specName: "4核16GB",
    qty: 2,
    cycle: "包月 × 3",
    projectId: "media-site",
    domainId: "media",
    applicant: "财经网值班编辑",
    createdAt: "2026-11-16 14:20",
    status: "待审批",
    reason: "配额校验通过。财经网月预算执行 85.8%，未触发 100% 拦截。",
  },
  {
    id: "APP-2026-1094",
    title: "标准对象存储 · 成片归档扩容",
    productName: "标准对象存储",
    specName: "标准存储 1TB",
    qty: 80,
    cycle: "包月 × 12",
    projectId: "fusion-cms",
    domainId: "fusion",
    applicant: "沈清和",
    createdAt: "2026-11-14 09:05",
    status: "已拦截",
    reason: "申请 80TB，内容生产中台对象存储配额上限 20TB、已用 16TB。超配额拦截，未进入审批。项目预算执行亦已超过 100%。",
  },
];

export const initialTickets: Ticket[] = [
  {
    id: "tk-1790",
    no: "TK-2026-1790",
    type: "技术支持",
    title: "专属云编辑节点磁盘水位咨询",
    domainId: "fusion",
    projectId: "fusion-cms",
    status: "审批中",
    applicant: "沈清和",
    createdAt: "2026-11-17 11:24",
    overdue: false,
    content: "ded-edit-01 / 02 数据盘水位超过 70%，咨询是否走主机调整配置，还是先做媒资归档。",
    comments: [{ actor: "马昭", time: "2026-11-17 15:02", text: "建议先出临期与容量报表，再决定是否扩容。扩容执行放在二期。" }],
    flow: [
      { name: "提交", result: "已完成", actor: "沈清和", time: "2026-11-17 11:24" },
      { name: "域内受理", result: "已完成", actor: "林知夏", time: "2026-11-17 13:10" },
      { name: "集团 OA", result: "审批中", actor: "技术委员会", time: "2026-11-17 16:40" },
    ],
    oa: {
      pushed: "已推送",
      status: "审批中",
      nodes: [
        { name: "部门负责人", result: "同意", actor: "林知夏", time: "2026-11-17 16:12" },
        { name: "技术委员会", result: "处理中", actor: "待签", time: "—" },
      ],
    },
  },
  {
    id: "tk-1766",
    no: "TK-2026-1766",
    type: "项目配额申请",
    title: "融媒云平台 EIP 配额上调",
    domainId: "fusion",
    projectId: "fusion-platform",
    status: "已关闭",
    applicant: "陈予安",
    createdAt: "2026-11-08 10:18",
    overdue: false,
    content: "申请将项目 EIP 配额由 8 调整为 12，用于门户双活出口。",
    comments: [{ actor: "许承志", time: "2026-11-09 09:20", text: "审批意见已回传，配额台账已更新。" }],
    flow: [
      { name: "提交", result: "已完成", actor: "陈予安", time: "2026-11-08 10:18" },
      { name: "集团 OA", result: "已通过", actor: "集团 OA", time: "2026-11-09 09:02" },
      { name: "配额生效", result: "已完成", actor: "平台", time: "2026-11-09 09:06" },
    ],
    oa: {
      pushed: "已推送",
      status: "已回传",
      opinion: "同意上调至 12。请在平台配额台账登记，不另开云侧工单。",
      nodes: [
        { name: "项目所有者", result: "同意", actor: "陈予安", time: "2026-11-08 10:18" },
        { name: "域管理员", result: "同意", actor: "林知夏", time: "2026-11-08 17:40" },
        { name: "财务会签", result: "同意", actor: "顾衡", time: "2026-11-09 09:02" },
      ],
    },
  },
  {
    id: "tk-1712",
    no: "TK-2026-1712",
    type: "主机调整配置",
    title: "tech-data-01 数据盘扩容登记",
    domainId: "tech",
    projectId: "tech-data",
    status: "待处理",
    applicant: "马昭",
    createdAt: "2026-11-15 09:46",
    overdue: false,
    content: "数据仓库节点磁盘使用率 78%。一期不在本平台执行变配，请按既有渠道扩容后回写结果。",
    phaseNote: "配置变更二期开放",
    comments: [],
    flow: [
      { name: "提交", result: "已完成", actor: "马昭", time: "2026-11-15 09:46" },
      { name: "运营受理", result: "待处理", actor: "云运营", time: "—" },
    ],
  },
  {
    id: "tk-1688",
    no: "TK-2026-1688",
    type: "域配额申请",
    title: "财经传媒计算配额年度复核",
    domainId: "media",
    projectId: "media-site",
    status: "已超时",
    applicant: "财经网值班编辑",
    createdAt: "2026-11-02 08:30",
    overdue: true,
    content: "域配额年度复核单超过 5 个工作日未完成会签。",
    comments: [{ actor: "系统", time: "2026-11-10 09:00", text: "已按超时规则提醒域管理员与财务。" }],
    flow: [
      { name: "提交", result: "已完成", actor: "财经网值班编辑", time: "2026-11-02 08:30" },
      { name: "财务会签", result: "超时", actor: "财务共享中心", time: "—" },
    ],
    oa: {
      pushed: "已推送",
      status: "审批中",
      nodes: [
        { name: "部门负责人", result: "同意", actor: "财经传媒", time: "2026-11-02 18:00" },
        { name: "财务会签", result: "超时未处理", actor: "财务共享中心", time: "—" },
      ],
    },
  },
  {
    id: "vnd-ali-88231",
    no: "VND-ALI-88231",
    type: "厂商工单",
    title: "阿里云故障：rm-web-01 公网入向丢包",
    domainId: "fusion",
    projectId: "fusion-platform",
    status: "处理中",
    applicant: "云平台运营",
    createdAt: "2026-11-18 07:48",
    overdue: false,
    content: "门户节点 rm-web-01 公网入向丢包升高，已通过阿里云工单接口同步到本平台，便于与内部告警对照。",
    comments: [{ actor: "同步任务", time: "2026-11-18 08:16", text: "厂商状态更新为：网络侧排查中。" }],
    flow: [
      { name: "厂商受理", result: "已同步", actor: "阿里云", time: "2026-11-18 07:50" },
      { name: "平台关联告警", result: "已关联 ALT-1042", actor: "平台", time: "2026-11-18 07:52" },
    ],
    vendor: {
      cloudId: "aliyun",
      vendorNo: "ALI-202611-88231",
      source: "API 同步",
      vendorStatus: "处理中",
      updatedAt: "2026-11-18 08:16",
    },
  },
  {
    id: "vnd-hw-44120",
    no: "VND-HW-44120",
    type: "厂商工单",
    title: "华为云账单咨询：11 月存储出流量",
    domainId: "media",
    projectId: "media-site",
    status: "待处理",
    applicant: "顾衡",
    createdAt: "2026-11-13 16:05",
    overdue: false,
    content: "华为云暂未开放该账号的工单拉取接口，由财务在平台手工登记，跟踪 11 月 12 日存储出流量异常。",
    comments: [],
    flow: [{ name: "人工登记", result: "已登记", actor: "顾衡", time: "2026-11-13 16:05" }],
    vendor: {
      cloudId: "huawei",
      vendorNo: "HW-44120",
      source: "人工登记",
      vendorStatus: "待厂商回复",
      updatedAt: "2026-11-13 16:05",
    },
  },
];

export const aiModels: AiModel[] = [
  { id: "qwen-max", name: "通义千问-Max", kind: "LLM", cloudId: "aliyun", context: "32K", unit: "千 token", stream: true },
  { id: "qwen-plus", name: "通义千问-Plus", kind: "LLM", cloudId: "aliyun", context: "128K", unit: "千 token", stream: true },
  { id: "pangu", name: "盘古大模型", kind: "LLM", cloudId: "huawei", context: "32K", unit: "千 token", stream: true },
  { id: "hunyuan", name: "混元-Pro", kind: "LLM", cloudId: "tencent", context: "32K", unit: "千 token", stream: true },
  { id: "doubao", name: "豆包-Pro", kind: "LLM", cloudId: "volc", context: "32K", unit: "千 token", stream: true },
  { id: "ocr-ali", name: "通用文字识别", kind: "视觉", cloudId: "aliyun", context: "图片", unit: "次", stream: false },
  { id: "ocr-tx", name: "票据识别", kind: "视觉", cloudId: "tencent", context: "图片", unit: "次", stream: false },
  { id: "tag-hw", name: "图像标签", kind: "视觉", cloudId: "huawei", context: "图片", unit: "次", stream: false },
  { id: "asr-ali", name: "实时语音识别", kind: "语音", cloudId: "aliyun", context: "音频流", unit: "秒", stream: true },
  { id: "tts-tx", name: "语音合成标准音色", kind: "语音", cloudId: "tencent", context: "文本", unit: "千字符", stream: true },
  { id: "tts-volc", name: "语音合成", kind: "语音", cloudId: "volc", context: "文本", unit: "千字符", stream: true },
];

export const initialKeys: VirtualKey[] = [
  { id: "key-rm", name: "融媒云平台-生产", mask: "mjy-prod-••••-18af", projectId: "fusion-platform", modelIds: ["qwen-plus", "ocr-ali"], qps: 30, tokenQuota: 20000000, usedTokens: 12840000, createdAt: "2026-09-01", status: "启用" },
  { id: "key-cms", name: "内容生产中台-识别", mask: "mjy-cms-••••-77c2", projectId: "fusion-cms", modelIds: ["ocr-tx", "qwen-plus"], qps: 10, tokenQuota: 8000000, usedTokens: 3560000, createdAt: "2026-09-18", status: "启用" },
  { id: "key-tech", name: "技术中台-助手", mask: "mjy-tech-••••-09e1", projectId: "tech-platform", modelIds: ["hunyuan"], qps: 10, tokenQuota: 5000000, usedTokens: 980000, createdAt: "2026-10-09", status: "启用" },
];

export const initialRoutes: RouteRule[] = [
  { id: "route-llm", name: "默认大模型路由", match: "模型类型 = LLM，未指定供应商", strategy: "权重", weights: [
    { modelId: "qwen-plus", weight: 50 },
    { modelId: "hunyuan", weight: 30 },
    { modelId: "pangu", weight: 20 },
  ] },
  { id: "route-ocr", name: "票据识别路由", match: "标签 = 票据", strategy: "标签", weights: [
    { modelId: "ocr-tx", weight: 70 },
    { modelId: "ocr-ali", weight: 30 },
  ] },
  { id: "route-speech", name: "内容生产语音合成", match: "项目 = 内容生产中台，类型 = 语音合成", strategy: "项目", weights: [
    { modelId: "tts-volc", weight: 100 },
  ] },
];

export const aiAudits: AiAuditRow[] = [
  { id: "call-1", time: "2026-11-18 08:21", keyId: "key-rm", projectId: "fusion-platform", modelId: "qwen-plus", inputTokens: 1820, outputTokens: 640, latencyMs: 860, status: "成功" },
  { id: "call-2", time: "2026-11-18 08:14", keyId: "key-cms", projectId: "fusion-cms", modelId: "ocr-tx", inputTokens: 0, outputTokens: 420, latencyMs: 310, status: "成功" },
  { id: "call-3", time: "2026-11-18 08:02", keyId: "key-rm", projectId: "fusion-platform", modelId: "qwen-plus", inputTokens: 2460, outputTokens: 90, latencyMs: 140, status: "内容拦截" },
  { id: "call-4", time: "2026-11-18 07:41", keyId: "key-tech", projectId: "tech-platform", modelId: "hunyuan", inputTokens: 980, outputTokens: 510, latencyMs: 740, status: "成功" },
  { id: "call-5", time: "2026-11-17 22:16", keyId: "key-cms", projectId: "fusion-cms", modelId: "qwen-plus", inputTokens: 6400, outputTokens: 0, latencyMs: 20, status: "限流" },
  { id: "call-6", time: "2026-11-17 19:05", keyId: "key-rm", projectId: "fusion-platform", modelId: "ocr-ali", inputTokens: 0, outputTokens: 260, latencyMs: 280, status: "成功" },
  { id: "call-7", time: "2026-11-17 11:28", keyId: "key-tech", projectId: "tech-platform", modelId: "hunyuan", inputTokens: 1540, outputTokens: 880, latencyMs: 1020, status: "成功" },
  { id: "call-8", time: "2026-11-16 16:44", keyId: "key-cms", projectId: "fusion-cms", modelId: "tts-volc", inputTokens: 360, outputTokens: 0, latencyMs: 450, status: "成功" },
];

export const aiAllocations: AiAllocation[] = [
  { projectId: "fusion-platform", input: 18420000, output: 6110000 },
  { projectId: "fusion-cms", input: 9860000, output: 3420000 },
  { projectId: "tech-platform", input: 4250000, output: 1180000 },
  { projectId: "media-site", input: 1640000, output: 520000 },
];

export const alerts: AlertItem[] = [
  { id: "alt-1042", level: "严重", status: "未恢复", title: "rm-web-01 CPU 使用率连续 15 分钟高于 90%", resource: "rm-web-01", policy: "虚拟机 CPU", time: "2026-11-18 07:42", channels: ["邮件", "钉钉"], detail: "门户节点 CPU 在早高峰后维持高位。同期阿里云故障工单 ALI-202611-88231 报告公网入向丢包，建议对照查看，避免把网络抖动误判为单纯算力不足。", domainId: "fusion", projectId: "fusion-platform", href: "/console/compute/rm-web-01" },
  { id: "alt-1038", level: "警告", status: "未恢复", title: "对象存储桶策略为公共读写", resource: "oss-rm-public", policy: "配置合规", time: "2026-11-18 06:10", channels: ["飞书"], detail: "内容生产中台桶 oss-rm-public 允许匿名读写。建议改为私有，并通过临时访问地址对外分发。", domainId: "fusion", projectId: "fusion-cms", href: "/console/storage/oss-rm-public" },
  { id: "alt-1031", level: "警告", status: "未恢复", title: "火山引擎账号余额低于阈值", resource: "火山引擎-融媒实验", policy: "云账号余额", time: "2026-11-17 21:06", channels: ["短信", "邮件"], detail: "余额 ¥28,600，阈值 ¥30,000。实验环境模型调用仍在产生按量费用。", domainId: "fusion", projectId: "fusion-platform", href: "/console/accounts/acc-volc" },
  { id: "alt-1024", level: "提示", status: "未恢复", title: "media-cms-01 连续两个同步周期失败", resource: "media-cms-01", policy: "资源同步", time: "2026-11-18 05:48", channels: ["企业微信"], detail: "华为云该实例监控与配置均未刷新。台账状态记为同步异常，不代表实例一定已关机。", domainId: "media", projectId: "media-site", href: "/console/compute/media-cms-01" },
  { id: "alt-1019", level: "严重", status: "未恢复", title: "fin-app-02 磁盘使用率高于 85%", resource: "fin-app-02", policy: "虚拟机磁盘", time: "2026-11-18 04:12", channels: ["Webhook", "邮件"], detail: "财务专区应用盘水位过高，且最近一次同步失败。需要同时核对采集链路与磁盘本身。", domainId: "finance", projectId: "fin-core", href: "/console/compute/fin-app-02" },
  { id: "alt-0988", level: "警告", status: "已恢复", title: "tech-gw-01 CPU 短时超过 85%", resource: "tech-gw-01", policy: "虚拟机 CPU", time: "2026-11-16 02:18", channels: ["邮件"], detail: "持续 6 分钟后回落，已自动恢复。", domainId: "tech", projectId: "tech-platform", href: "/console/compute/tech-gw-01" },
  { id: "alt-0972", level: "提示", status: "已恢复", title: "移动云余额曾低于阈值", resource: "移动云-集团办公", policy: "云账号余额", time: "2026-11-12 10:02", channels: ["邮件"], detail: "充值到账后恢复。", domainId: "tech", projectId: "tech-platform", href: "/console/accounts/acc-cmcc" },
];

export const initialPolicies: AlertPolicy[] = [
  { id: "p1", name: "宿主机 CPU", category: "内置 · 宿主机", condition: "CPU > 90%，连续 3 个周期", level: "严重", enabled: true },
  { id: "p2", name: "宿主机内存", category: "内置 · 宿主机", condition: "内存 > 90%，连续 3 个周期", level: "严重", enabled: true },
  { id: "p3", name: "宿主机磁盘", category: "内置 · 宿主机", condition: "磁盘 > 85%", level: "警告", enabled: true },
  { id: "p4", name: "宿主机负载", category: "内置 · 宿主机", condition: "1 分钟负载 > 核数 × 2", level: "警告", enabled: true },
  { id: "p5", name: "磁盘健康", category: "内置 · 硬件", condition: "SMART 预测故障", level: "严重", enabled: true },
  { id: "p6", name: "僵尸进程", category: "内置 · 主机", condition: "僵尸进程数 > 20", level: "提示", enabled: true },
  { id: "p7", name: "RAID 状态", category: "内置 · 硬件", condition: "阵列降级", level: "严重", enabled: true },
  { id: "p8", name: "云账号余额", category: "内置 · 账号", condition: "余额低于账号阈值", level: "警告", enabled: true },
  { id: "p9", name: "虚拟机 CPU", category: "内置 · 虚拟机", condition: "CPU > 90%，连续 15 分钟", level: "严重", enabled: true },
  { id: "p10", name: "虚拟机内存", category: "内置 · 虚拟机", condition: "内存 > 90%，连续 15 分钟", level: "警告", enabled: true },
  { id: "p11", name: "虚拟机磁盘", category: "内置 · 虚拟机", condition: "磁盘 > 85%", level: "严重", enabled: true },
  { id: "p12", name: "虚拟机网络", category: "内置 · 虚拟机", condition: "出网带宽利用率 > 85%", level: "警告", enabled: false },
  { id: "p13", name: "数据库连接数", category: "内置 · 数据库", condition: "连接数 > 上限 80%", level: "警告", enabled: true },
];

export const channels: Channel[] = [
  { id: "mail", name: "邮件", target: "云平台运营值班组", status: "已验证", usage: "严重与警告告警、账单异常" },
  { id: "sms", name: "短信", target: "值班联系人（号码已脱敏）", status: "已验证", usage: "账号余额与严重告警升级" },
  { id: "ding", name: "钉钉", target: "每经云运维群", status: "已验证", usage: "门户与生产告警" },
  { id: "feishu", name: "飞书", target: "融媒云告警群", status: "已验证", usage: "内容生产与安全检查" },
  { id: "wecom", name: "企业微信", target: "技术中心运维应用", status: "已验证", usage: "同步异常与办公区资源" },
  { id: "hook", name: "Webhook", target: "集团监控总线", status: "待验证", usage: "财务专区严重告警转发" },
];

export const jobs: Job[] = [
  { id: "job-sync", name: "资源增量同步", schedule: "每 30 分钟", lastRun: "2026-11-18 08:12", lastResult: "成功", note: "按云账号拉取计算、网络、存储、数据库的变更。", history: [
    { time: "2026-11-18 08:12", result: "成功 · 变更 14" },
    { time: "2026-11-18 07:42", result: "成功 · 变更 6" },
    { time: "2026-11-18 07:12", result: "成功 · 变更 2" },
    { time: "2026-11-18 06:42", result: "延迟 · 天翼云专属云超时" },
    { time: "2026-11-18 06:12", result: "成功 · 变更 9" },
  ] },
  { id: "job-bill", name: "账单采集", schedule: "每天 06:00", lastRun: "2026-11-18 06:02", lastResult: "成功", note: "采集昨日流水并归集到项目。", history: [
    { time: "2026-11-18 06:02", result: "成功" },
    { time: "2026-11-17 06:03", result: "成功" },
    { time: "2026-11-16 06:08", result: "成功 · 华为云延迟 6 分钟" },
  ] },
  { id: "job-idle", name: "低负载与闲置巡检", schedule: "每周一 07:30", lastRun: "2026-11-17 07:31", lastResult: "成功", note: "产出成本优化建议，不直接变更资源。", history: [
    { time: "2026-11-17 07:31", result: "成功 · 5 条建议" },
    { time: "2026-11-10 07:30", result: "成功 · 4 条建议" },
  ] },
  { id: "job-power", name: "渲染节点定时关机", schedule: "每天 23:00", lastRun: "—", lastResult: "未执行", phase: "二期开放", note: "计划已登记。一期不向云平台下发开关机指令。", history: [
    { time: "2026-11-17 23:00", result: "跳过 · 二期才执行" },
    { time: "2026-11-16 23:00", result: "跳过 · 二期才执行" },
  ] },
];

export const initialAudits: AuditEvent[] = [
  { id: "aud-1", time: "2026-11-18 08:26", actor: "周启明", role: "平台管理员", action: "登录", target: "集团统一认证回调", result: "成功", source: "平台" },
  { id: "aud-2", time: "2026-11-18 08:12", actor: "同步任务", role: "系统", action: "资源同步", target: "阿里云-集团生产", result: "成功", source: "云上同步" },
  { id: "aud-3", time: "2026-11-18 07:40", actor: "同步任务", role: "系统", action: "资源同步", target: "火山引擎-融媒实验", result: "成功", source: "云上同步" },
  { id: "aud-4", time: "2026-11-18 06:22", actor: "健康检查", role: "系统", action: "凭据检查", target: "天翼云-融媒分发", result: "成功", source: "平台" },
  { id: "aud-5", time: "2026-11-17 18:02", actor: "林知夏", role: "域管理员", action: "查看安全检查", target: "sg-rm-web", result: "成功", source: "平台" },
  { id: "aud-6", time: "2026-11-17 11:20", actor: "陈予安", role: "项目所有者", action: "查看虚拟 API Key", target: "融媒云平台-生产", result: "成功", source: "平台" },
  { id: "aud-7", time: "2026-11-16 15:11", actor: "顾衡", role: "财务", action: "导出项目账单", target: "2026-10 融媒云事业部", result: "成功", source: "平台" },
  { id: "aud-8", time: "2026-11-14 09:06", actor: "配额引擎", role: "系统", action: "拦截申请", target: "APP-2026-1094", result: "拒绝", source: "平台" },
  { id: "aud-9", time: "2026-11-09 09:06", actor: "平台", role: "系统", action: "配额生效", target: "融媒云平台 EIP", result: "成功", source: "平台" },
  { id: "aud-10", time: "2026-11-08 21:14", actor: "云上操作日志", role: "阿里云", action: "控制台登录", target: "阿里云-集团生产", result: "成功", source: "云上同步" },
];

export const initialMessages: AppMessage[] = [
  { id: "m1", title: "严重告警未恢复", body: "rm-web-01 CPU 持续高于 90%。", time: "07:42", href: "/console/monitor/alerts/alt-1042", unread: true },
  { id: "m2", title: "有待审批的市场申请", body: "财经网检索扩容等待部门审批。", time: "昨天", href: "/console/market-ops/approvals", unread: true },
  { id: "m3", title: "云账号余额告警", body: "火山引擎-融媒实验余额低于阈值。", time: "昨天", href: "/console/accounts/acc-volc", unread: true },
  { id: "m4", title: "10 月月报已生成", body: "可在运营报表中查阅。", time: "11-02", href: "/console/reports/monthly-2026-10", unread: false },
];

export const findings: SecurityFinding[] = [
  { id: "sec-sg", kind: "安全组全开放", title: "sg-rm-web 对全网开放 22、80、443", level: "高危", resource: "sg-rm-web", href: "/console/network/sg-rm-web", advice: "将 22 端口收敛到堡垒机网段，80/443 仅保留负载均衡回源。规则变更于二期开放，一期可登记整改工单。", domainId: "fusion", projectId: "fusion-platform" },
  { id: "sec-oss", kind: "对象存储公共读写", title: "oss-rm-public 允许匿名读写", level: "高危", resource: "oss-rm-public", href: "/console/storage/oss-rm-public", advice: "改为私有，并为需要外发的对象签发临时访问地址。ACL 变更于二期开放。", domainId: "fusion", projectId: "fusion-cms" },
];

export const reports: ReportDoc[] = [
  { id: "monthly-2026-10", name: "2026年10月集团云资源月报", kind: "月报", period: "2026-10", status: "已生成" },
  { id: "daily-2026-11-17", name: "2026年11月17日资源与费用日报", kind: "日报", period: "2026-11-17", status: "已生成" },
  { id: "expire-2026-11", name: "2026年11月临期资源报表", kind: "临期资源", period: "2026-11", status: "已生成" },
];

export const quotas: QuotaRow[] = [
  { scope: "域", name: "融媒云事业部", refId: "fusion", vm: [86, 120], cpu: [420, 640], mem: [960, 1600], disk: [48, 80], eip: [18, 32], ossTb: [36, 60] },
  { scope: "域", name: "技术中心", refId: "tech", vm: [64, 100], cpu: [380, 560], mem: [820, 1400], disk: [40, 70], eip: [12, 24] },
  { scope: "域", name: "财经传媒", refId: "media", vm: [22, 40], cpu: [96, 180], mem: [220, 400], disk: [12, 24], eip: [6, 12] },
  { scope: "域", name: "财务共享中心", refId: "finance", vm: [8, 16], cpu: [32, 64], mem: [80, 160], disk: [8, 16], eip: [2, 4] },
  { scope: "项目", name: "融媒云平台", refId: "fusion-platform", vm: [28, 40], cpu: [160, 240], mem: [384, 512], disk: [18, 30], eip: [8, 12] },
  { scope: "项目", name: "内容生产中台", refId: "fusion-cms", vm: [22, 36], cpu: [120, 200], mem: [280, 480], disk: [16, 28], eip: [4, 8], ossTb: [16, 20] },
  { scope: "项目", name: "技术中台", refId: "tech-platform", vm: [18, 30], cpu: [80, 160], mem: [180, 320], disk: [10, 20], eip: [4, 8] },
  { scope: "项目", name: "数据平台", refId: "tech-data", vm: [12, 24], cpu: [96, 160], mem: [240, 400], disk: [16, 30], eip: [2, 6] },
];

export const compareRows: CompareRow[] = [
  { cloudId: "aliyun", mode: "包月", price: "¥428 / 月" },
  { cloudId: "huawei", mode: "包月", price: "¥446 / 月" },
  { cloudId: "tencent", mode: "包月", price: "¥439 / 月" },
  { cloudId: "volc", mode: "包月", price: "¥412 / 月" },
  { cloudId: "cmcc", mode: "包月", price: "¥458 / 月" },
  { cloudId: "ctyun", mode: "包月", price: "¥451 / 月" },
  { cloudId: "cmcc-ded", mode: "资源池", price: "按资源池核算" },
  { cloudId: "ctyun-ded", mode: "资源池", price: "按资源池核算" },
];

export const expiring: ExpiringResource[] = [
  { name: "rm-web-01 包月", kind: "虚拟机", projectId: "fusion-platform", due: "2026-12-02", days: 14 },
  { name: "redis-rm", kind: "Redis", projectId: "fusion-platform", due: "2026-11-28", days: 10 },
  { name: "eip-ct-cdn", kind: "EIP", projectId: "fusion-platform", due: "2026-12-06", days: 18 },
  { name: "rds-media", kind: "数据库", projectId: "media-site", due: "2026-12-15", days: 27 },
];

export const vmOperationLogs = [
  { time: "2026-11-18 08:12", action: "同步配置与状态", actor: "资源同步", result: "成功" },
  { time: "2026-11-18 07:40", action: "采集 CPU / 内存 / 磁盘 / 网络", actor: "监控采集", result: "成功" },
  { time: "2026-11-12 01:10", action: "云侧自动备份窗口", actor: "云上同步", result: "已记录" },
];

export const scenes = [
  { id: "ops-qa", name: "智能运维问答", kind: "LLM", summary: "用自然语言询问多云资源现状与一期操作边界。" },
  { id: "alert-rca", name: "告警根因分析", kind: "LLM", summary: "汇聚关联指标、变更和厂商工单，给出排查方向。" },
  { id: "tag-ocr", name: "标签 OCR 录入", kind: "视觉", summary: "识别资产标签并写入台账草稿。" },
  { id: "voice-ops", name: "语音运维", kind: "语音", summary: "值班场景下用语音查询未恢复告警。" },
  { id: "cost-readout", name: "成本优化解读", kind: "LLM", summary: "把费用和优化建议写成管理层可读的说明。" },
] as const;

export type SceneId = (typeof scenes)[number]["id"];
