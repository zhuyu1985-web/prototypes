# 每经云界面地图

## 令牌

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| navy | `#0B1F3A` | 主色、侧栏、主按钮 |
| brand | `#C8102E` | 品牌、登录与提交、严重告警 |
| canvas | `#F3F5F8` | 控制台背景 |
| ink | `#142033` | 正文 |
| muted | `#5C6B80` | 次要说明 |
| line | `#E4E9F0` | 分割线 |
| ok | `#0F7B66` | 成功 |
| warn | `#8A5A00` | 警告 |
| 大屏底 | `#071422` | 投屏页 |

字体是系统中文黑体栈。标题约 22px，表格 13px，大屏关键数字 26–32px。

## 壳层

- 登录 `/`：集团统一认证登录。
- 认证确认 `/sso`：示意 OAuth 2.0，确认后进入控制台。
- 控制台：左侧导航 + 顶栏。顶栏含三级视图、部门/项目、搜索、资源大屏、费用大屏、市场、消息、身份切换。
- 市场 `/market`：独立顶栏，无控制台侧栏。
- 大屏 `/screens/*`：深色全屏，无侧栏，可切换四块大屏。

身份：平台管理员、域管理员、项目所有者、业务用户、财务。菜单和审批、签发、上架按钮按身份显隐。

## 路由

| 路径 | 页面 |
| --- | --- |
| `/console/overview` | 平台总览 |
| `/console/accounts` | 云账号 |
| `/console/accounts/connect` | 五步接入向导 |
| `/console/accounts/[id]` | 账号健康与同步 |
| `/console/compute` | 虚拟机台账 |
| `/console/compute/[id]` | 虚拟机详情与监控 |
| `/console/compute/containers` | 容器主机（三期） |
| `/console/compute/scheduling` | 调度策略（三期） |
| `/console/network` `/[id]` | 网络只读 |
| `/console/storage` `/[id]` | 存储只读 |
| `/console/database` `/[id]` | 数据库与中间件 |
| `/console/org` | 组织、17 个角色、配额、开放集成 |
| `/console/security` | 安全检查 |
| `/console/audit` | 操作审计 |
| `/console/ai` | AI 调度总览 |
| `/console/ai/models` | 模型目录 |
| `/console/ai/keys` | 虚拟 API Key |
| `/console/ai/routes` | 路由规则 |
| `/console/ai/quota` | 配额与限流 |
| `/console/ai/audit` | 调用审计与项目分摊 |
| `/console/ai/safety` | 内容安全 |
| `/console/ai/scenes` `/[scene]` | 五个场景演示 |
| `/console/billing` | 账单 |
| `/console/billing/analysis` | 多维分析，部门可下钻 |
| `/console/billing/forecast` | 预算、预测、异常 |
| `/console/billing/optimize` `/[id]` | 成本优化 |
| `/console/billing/compare` | 跨云比价 |
| `/console/reports` `/[id]` | 运营报表 |
| `/console/market-ops` | 产品上架 |
| `/console/market-ops/approvals` | 审批台 |
| `/console/tickets` `/new` `/[id]` | 工单 |
| `/console/monitor` | 监控总览 |
| `/console/monitor/panels` | 自定义面板 |
| `/console/monitor/policies` | 13 类告警策略 |
| `/console/monitor/alerts` `/[id]` | 告警与通知渠道 |
| `/console/monitor/maintenance` | 维护屏蔽 |
| `/console/monitor/channels` | 通知渠道 |
| `/console/monitor/jobs` | 定时任务 |
| `/console/monitor/inspection` | 环境巡检 |
| `/console/monitor/orchestration` | 应用编排（二期） |
| `/console/messages` | 消息 |
| `/console/search` | 全局搜索结果 |
| `/market` `/c/[category]` `/p/[id]` | 市场目录与详情 |
| `/market/cart` `/market/applications` | 购物车与申请进度 |
| `/screens/resource` | 资源使用情况大屏 |
| `/screens/cost` | 费用统计分析大屏 |
| `/screens/traffic` | 流量分析大屏 |
| `/screens/storage` | 存储分析大屏 |

## 组件

- `components/ui.tsx`：页面标题、卡片、按钮、阶段标签、表格、抽屉、徽标。
- `components/charts.tsx`：折线、条形、环形、水位。
- `components/shell.tsx`：控制台、大屏和市场三套框架。
- `components/bits.tsx`：登录门槛、角色门槛、范围说明。
- `lib/store.tsx`：会话状态。接入、购物车、审批、签发、路由和工单批注都留在浏览器会话里。

## 一期 / 二期

开机、关机、VNC、Web Shell、安全组与存储变更、自动交付、一键优化处理标「二期开放」。容器主机和调度策略标「三期开放」。审批通过只生成主机申请工单。
