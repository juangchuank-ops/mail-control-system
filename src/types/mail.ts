/**
 * MAIL CONTROL SYSTEM — 统一邮件数据模型
 *
 * Provider 负责把不同邮箱服务的原始数据转换成这里的统一结构。
 * UI 层只依赖这些类型，Provider 不允许改变 UI 数据结构。
 */

export type ProviderId = 'gmail' | 'qq' | 'outlook'

/** 通讯节点连接状态 */
export type NodeStatus = 'connected' | 'syncing' | 'disconnected' | 'error'

export interface MailAddress {
  name: string
  address: string
}

export interface MailAttachment {
  id: string
  filename: string
  mimeType: string
  /** bytes */
  size: number
}

export type MailLabel =
  | 'verification'
  | 'security'
  | 'order'
  | 'notification'
  | 'newsletter'
  | 'personal'
  | 'github'
  | 'billing'

export interface VerificationInfo {
  code: string
  /** 识别来源：verification_code / otp / security_code / manual */
  kind: string
  /** 代码过期时间（epoch ms），若邮件未声明则 undefined */
  expiresAt?: number
}

export interface MailMessage {
  id: string
  providerId: ProviderId
  threadId: string
  from: MailAddress
  to: MailAddress[]
  cc: MailAddress[]
  subject: string
  /** 列表预览（纯文本，已截断） */
  preview: string
  /** 纯文本正文 */
  body: string
  /** 可选 HTML 正文（真实 Provider 可用） */
  htmlBody?: string
  /** epoch ms */
  timestamp: number
  isRead: boolean
  isStarred: boolean
  hasAttachment: boolean
  attachments: MailAttachment[]
  labels: MailLabel[]
  verificationCode?: string
  verificationExpiresAt?: number
  folderId: string
}

export interface MailFolder {
  id: string
  name: string
  type: 'inbox' | 'sent' | 'drafts' | 'archive' | 'spam' | 'trash' | 'custom'
  messageCount: number
  unreadCount: number
}

/** 一个邮箱账户 = 一个 COMMUNICATION NODE */
export interface MailNode {
  id: ProviderId
  /** 工程编号，如 '01' */
  sequence: string
  provider: ProviderId
  /** 节点显示名，如 'GMAIL' */
  label: string
  address: string
  status: NodeStatus
  unread: number
  messageCount: number
  /** epoch ms，null 表示从未同步 */
  lastSyncAt: number | null
  /** 链路延迟（mock 值） */
  latencyMs: number
  folders: MailFolder[]
  /** 当前为 mock adapter */
  mock: boolean
}

export interface MailDraft {
  to: string[]
  cc?: string[]
  subject: string
  body: string
}

export interface SyncResult {
  nodeId: ProviderId
  fetched: number
  newMessages: number
  syncedAt: number
  durationMs: number
}

export type SortField = 'time' | 'sender' | 'subject'
export type SortOrder = 'asc' | 'desc'
export type ReadFilter = 'all' | 'read' | 'unread'

/** MESSAGE INDEX 的查询条件 */
export interface MailQuery {
  search: string
  providerId: ProviderId | 'all'
  read: ReadFilter
  starredOnly: boolean
  attachmentOnly: boolean
  label: MailLabel | 'all'
  sort: SortField
  order: SortOrder
  folderId: string
}

export const DEFAULT_QUERY: MailQuery = {
  search: '',
  providerId: 'all',
  read: 'all',
  starredOnly: false,
  attachmentOnly: false,
  label: 'all',
  sort: 'time',
  order: 'desc',
  folderId: 'inbox',
}

export interface MailProviderMeta {
  id: ProviderId
  label: string
  sequence: string
  mock: boolean
}
