/**
 * MAIL PROVIDER 抽象层
 *
 * UI 只与这个接口交互。新增一个邮箱服务时，只需要实现这个接口，
 * 不需要触碰任何 UI 组件。所有实现都必须返回统一数据模型
 * （src/types/mail.ts），禁止把原始服务字段泄漏到 UI。
 */

import type {
  MailAttachment,
  MailDraft,
  MailFolder,
  MailMessage,
  MailNode,
  MailProviderMeta,
  MailQuery,
  SyncResult,
} from '../../types'

export interface MailProvider {
  /** 节点静态元数据（编号 / 名称 / 是否 mock） */
  readonly meta: MailProviderMeta

  /** 建立链路，返回节点快照 */
  connect(): Promise<MailNode>
  /** 断开链路 */
  disconnect(): Promise<void>
  /** 当前节点快照（不触发 IO） */
  getNode(): MailNode

  /** 拉取某个目录下的全部邮件（不传则返回全部） */
  getMessages(folderId?: string): Promise<MailMessage[]>
  getMessage(id: string): Promise<MailMessage | null>

  /** 按查询条件检索（搜索 / 筛选 / 排序语义与 UI 完全一致） */
  searchMessages(query: MailQuery): Promise<MailMessage[]>

  markAsRead(id: string): Promise<MailMessage>
  markAsUnread(id: string): Promise<MailMessage>
  toggleStar(id: string): Promise<MailMessage>
  archiveMessage(id: string): Promise<MailMessage>
  deleteMessage(id: string): Promise<MailMessage>

  getAttachments(id: string): Promise<MailAttachment[]>
  sendMessage(draft: MailDraft): Promise<MailMessage>
  getFolders(): Promise<MailFolder[]>

  /** 同步节点，返回本次同步读数 */
  sync(): Promise<SyncResult>
}

/** 统一的链路延迟区间（ms），由各 Provider 覆写 */
export type LatencyRange = readonly [min: number, max: number]
