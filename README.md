# MAIL CONTROL SYSTEM

> 工业风多节点邮件控制终端 · Industrial multi-node mail control terminal

一个把「邮箱」当成「通讯节点」来操作的前端控制台。多路邮箱链路同时在线，统一索引、检索、筛选、读信、验证码提取，全部在一个 HUD 风格的界面里完成。

**当前全部数据来自内置 MOCK 模拟器，不连接任何真实邮箱，也不做任何持久化存储。**

---

## 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | React 19 + TypeScript 6 |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 4（`@theme` 设计令牌） |
| 路由 | React Router 7 |
| 状态 | Zustand 5（纯内存） |
| 动效 | GSAP / Motion / Lenis / 自研 DecryptedText 等 |
| 校验 | Oxlint |
| 测试 | Vitest + Testing Library（jsdom） |

---

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
```

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm run lint` | Oxlint 检查 |
| `npm run test` | 跑全部测试 |

要求 Node 20+。

---

## 功能地图

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 控制台 | 节点总览、链路状态、同步读数 |
| `/mail` | 邮件工作台 | 索引 / 搜索 / 筛选 / 批量操作 |
| `/mail/:id` | 单条记录 | 完整读数、附件、验证码提取面板 |
| `/accounts` | 节点账户 | 各通讯节点卡片与连接管理 |
| `/settings` | 终端设置 | 密度、语言、动效、自动同步 |
| `/about` | 系统信息 | 技术栈与设计说明 |

其它能力：已读/未读、星标、归档、删除、Toast 提示、空态/错误态、Lenis 平滑滚动的长文档页、中英双语（默认中文）。

---

## 架构

```
src/
├─ routes/          路由表
├─ pages/           页面容器
├─ components/
│  ├─ ui/           基础组件（Button / Panel / Modal / Toast …）
│  ├─ hud/          工业 HUD 外壳（边框、网格背景、读数条）
│  ├─ mail/         邮件域组件
│  ├─ layout/       应用外壳、状态栏、系统头
│  ├─ motion/       动效原语
│  └─ boot/         开机自检序列
├─ providers/mail/  MailProvider 抽象层 + 各节点实现 + 注册表
├─ store/           Zustand：mail / settings / toast
├─ data/mock/       MOCK 数据工厂
├─ lib/             纯函数：检索、验证码提取、格式化、i18n
├─ hooks/           自研 hooks
├─ styles/          设计令牌与全局样式
└─ types/           统一数据模型
```

### 核心约束：Provider 抽象层

UI **只**与 `MailProvider` 接口交互（`src/providers/mail/MailProvider.ts`）。新增一个邮箱服务只需要实现该接口并注册进 `registry.ts`，不用碰任何 UI 组件。所有实现必须返回统一数据模型 `src/types/mail.ts`，原始服务字段不得泄漏到 UI 层。

```ts
export interface MailProvider {
  readonly meta: MailProviderMeta
  connect(): Promise<MailNode>
  disconnect(): Promise<void>
  getNode(): MailNode
  getMessages(folderId?: string): Promise<MailMessage[]>
  getMessage(id: string): Promise<MailMessage | null>
  searchMessages(query: MailQuery): Promise<MailMessage[]>
  markAsRead(id: string): Promise<MailMessage>
  markAsUnread(id: string): Promise<MailMessage>
  toggleStar(id: string): Promise<MailMessage>
  archiveMessage(id: string): Promise<MailMessage>
  deleteMessage(id: string): Promise<MailMessage>
  getAttachments(id: string): Promise<MailAttachment[]>
  sendMessage(draft: MailDraft): Promise<MailMessage>
  getFolders(): Promise<MailFolder[]>
  sync(): Promise<SyncResult>
}
```

内置三个节点，顺序即编号：`01 GMAIL` → `02 QQ MAIL` → `03 OUTLOOK`。

---

## 说明与边界

- **无后端**：全部数据 MOCK 生成，刷新即恢复默认。
- **无持久化**：设置与状态仅存于内存，不写 localStorage（避免 SSR / JSON 兼容问题）。
- **无鉴权**：没有真实账号体系，Provider 实现里不会存放任何密钥。
- 设置不做持久化是有意为之，若要加回来建议放在 `providers/` 层而不是组件里。

---

## License

MIT