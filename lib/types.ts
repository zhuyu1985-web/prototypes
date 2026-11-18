export type CloudId =
  | "aliyun"
  | "huawei"
  | "tencent"
  | "volc"
  | "cmcc"
  | "ctyun"
  | "cmcc-ded"
  | "ctyun-ded";

export type DomainId = "tech" | "media" | "fusion" | "finance";

export type ProjectId =
  | "fusion-platform"
  | "fusion-cms"
  | "tech-platform"
  | "tech-data"
  | "media-site"
  | "fin-core";

export type RoleId =
  | "platform_admin"
  | "domain_admin"
  | "project_owner"
  | "business"
  | "finance";

export type ViewLevel = "admin" | "domain" | "project";

export type ResourceType = "计算" | "存储" | "网络" | "数据库" | "AI 调用" | "其他";

export type BillingMode = "按量" | "包月" | "资源包";

export type Cloud = {
  id: CloudId;
  name: string;
  kind: "公有云" | "专属云";
};

export type Domain = { id: DomainId; name: string };

export type Project = { id: ProjectId; name: string; domainId: DomainId };

export type AccountHealth = "正常" | "凭据将过期" | "同步延迟" | "连接失败";

export type CloudAccount = {
  id: string;
  name: string;
  cloudId: CloudId;
  domainId: DomainId;
  health: AccountHealth;
  lastSync: string;
  balance: number | null;
  balanceThreshold: number | null;
  discountLabel: string;
  access: "只读";
  session?: boolean;
  regions: string[];
  billCollect: string;
  syncCron: string;
};

export type VmStatus = "运行中" | "已停止" | "同步异常";

export type Vm = {
  id: string;
  name: string;
  cloudId: CloudId;
  accountId: string;
  region: string;
  domainId: DomainId;
  projectId: ProjectId;
  status: VmStatus;
  cpu: number;
  memoryGb: number;
  diskGb: number;
  os: string;
  privateIp: string;
  publicIp?: string;
  tags: string[];
  cpuAvg: number;
  memAvg: number;
  createdAt: string;
  lowLoad?: boolean;
};

export type NetKind = "VPC" | "子网" | "安全组" | "EIP" | "NAT" | "DNS" | "负载均衡";

export type NetItem = {
  id: string;
  kind: NetKind;
  name: string;
  cloudId: CloudId;
  domainId: DomainId;
  projectId: ProjectId;
  region: string;
  status: string;
  summary: string;
  risk?: string;
  cidr?: string;
  rules?: { dir: string; proto: string; port: string; source: string; action: string }[];
};

export type StorageKind = "对象存储" | "云盘";

export type StorageItem = {
  id: string;
  kind: StorageKind;
  name: string;
  cloudId: CloudId;
  domainId: DomainId;
  projectId: ProjectId;
  size: string;
  status: string;
  tier: string;
  attachedTo?: string;
  acl?: string;
  risk?: string;
};

export type DbEngine = "RDS MySQL" | "RDS PostgreSQL" | "Redis" | "MongoDB" | "Kafka" | "Elasticsearch";

export type DbItem = {
  id: string;
  engine: DbEngine;
  name: string;
  cloudId: CloudId;
  domainId: DomainId;
  projectId: ProjectId;
  spec: string;
  status: string;
  endpoint: string;
};

export type CostFact = {
  cloudId: CloudId;
  domainId: DomainId;
  projectId: ProjectId;
  resourceType: ResourceType;
  billingMode: BillingMode;
  amount: number;
  yearAmount: number;
};

export type Budget = {
  id: string;
  level: "域" | "项目";
  name: string;
  refId: string;
  period: "月";
  amount: number;
  used: number;
};

export type Optimization = {
  id: string;
  kind: "低负载虚拟机" | "闲置 EIP" | "未挂载云盘" | "空闲 Redis";
  title: string;
  resourceName: string;
  href: string;
  domainId: DomainId;
  projectId: ProjectId;
  saving: number;
  detail: string;
  suggestion: string;
};

export type Anomaly = {
  id: string;
  title: string;
  domainId: DomainId;
  projectId: ProjectId;
  time: string;
  detail: string;
};

export type ProductCategory = "计算" | "存储" | "数据库" | "中间件" | "组合服务";

export type ProductSpec = {
  id: string;
  name: string;
  monthly: number;
  usage: string;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  summary: string;
  detail: string;
  scene: string;
  visibility: string;
  specs: ProductSpec[];
  session?: boolean;
};

export type CartLine = {
  lineId: string;
  productId: string;
  specId: string;
  qty: number;
  cycle: "包月" | "按量";
  months: number;
  projectId: ProjectId;
};

export type ApplicationStatus = "待审批" | "已通过" | "已驳回" | "已拦截";

export type Application = {
  id: string;
  title: string;
  productName: string;
  specName: string;
  qty: number;
  cycle: string;
  projectId: ProjectId;
  domainId: DomainId;
  applicant: string;
  createdAt: string;
  status: ApplicationStatus;
  reason: string;
  session?: boolean;
  ticketNo?: string;
};

export type FlowNode = { name: string; result: string; actor: string; time: string };

export type Ticket = {
  id: string;
  no: string;
  type: string;
  title: string;
  domainId: DomainId;
  projectId: ProjectId;
  status: "待处理" | "审批中" | "待交付" | "处理中" | "已关闭" | "已超时";
  applicant: string;
  createdAt: string;
  overdue: boolean;
  content: string;
  phaseNote?: string;
  sourceApp?: string;
  comments: { actor: string; time: string; text: string }[];
  flow: FlowNode[];
  oa?: {
    pushed: string;
    status: "审批中" | "已回传";
    nodes: FlowNode[];
    opinion?: string;
  };
  vendor?: {
    cloudId: CloudId;
    vendorNo: string;
    source: "API 同步" | "人工登记";
    vendorStatus: string;
    updatedAt: string;
  };
};

export type AiKind = "LLM" | "视觉" | "语音";

export type AiModel = {
  id: string;
  name: string;
  kind: AiKind;
  cloudId: CloudId;
  context: string;
  unit: string;
  stream: boolean;
};

export type VirtualKey = {
  id: string;
  name: string;
  mask: string;
  reveal?: string;
  projectId: ProjectId;
  modelIds: string[];
  qps: number;
  tokenQuota: number;
  usedTokens: number;
  createdAt: string;
  status: "启用" | "停用";
  session?: boolean;
};

export type RouteRule = {
  id: string;
  name: string;
  match: string;
  strategy: "权重" | "标签" | "项目";
  weights: { modelId: string; weight: number }[];
};

export type AiAuditRow = {
  id: string;
  time: string;
  keyId: string;
  projectId: ProjectId;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  status: "成功" | "内容拦截" | "限流";
};

export type AiAllocation = {
  projectId: ProjectId;
  input: number;
  output: number;
};

export type AlertItem = {
  id: string;
  level: "严重" | "警告" | "提示";
  status: "未恢复" | "已恢复";
  title: string;
  resource: string;
  policy: string;
  time: string;
  channels: string[];
  detail: string;
  domainId: DomainId;
  projectId: ProjectId;
  href?: string;
};

export type AlertPolicy = {
  id: string;
  name: string;
  category: string;
  condition: string;
  level: "严重" | "警告" | "提示";
  enabled: boolean;
};

export type Channel = {
  id: string;
  name: string;
  target: string;
  status: "已验证" | "待验证";
  usage: string;
};

export type Job = {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  lastResult: string;
  phase?: "二期开放";
  note: string;
  history: { time: string; result: string }[];
};

export type AuditEvent = {
  id: string;
  time: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  result: "成功" | "拒绝";
  source: "平台" | "云上同步";
};

export type AppMessage = {
  id: string;
  title: string;
  body: string;
  time: string;
  href: string;
  unread: boolean;
};

export type SecurityFinding = {
  id: string;
  kind: string;
  title: string;
  level: "高危" | "中危";
  resource: string;
  href: string;
  advice: string;
  domainId: DomainId;
  projectId: ProjectId;
};

export type ReportDoc = {
  id: string;
  name: string;
  kind: "月报" | "日报" | "临期资源";
  period: string;
  status: string;
  session?: boolean;
};

export type QuotaRow = {
  scope: "域" | "项目";
  name: string;
  refId: string;
  vm: [number, number];
  cpu: [number, number];
  mem: [number, number];
  disk: [number, number];
  eip: [number, number];
  ossTb?: [number, number];
};

export type CompareRow = {
  cloudId: CloudId;
  mode: string;
  price: string;
};

export type ExpiringResource = {
  name: string;
  kind: string;
  projectId: ProjectId;
  due: string;
  days: number;
};
