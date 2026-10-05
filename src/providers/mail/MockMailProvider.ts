/**
 * MockMailProvider — 内存态邮件 Provider
 *
 * 行为特征刻意贴近真实网络：
 *  - 每次调用都有 110–320ms 的模拟链路延迟（不同节点延迟不同）
 *  - 所有写操作都作用于内部副本，返回新对象（不可变更新）
 *  - 节点状态机：disconnected → connected → syncing → connected
 */

import { applyQuery, countUnread } from '../../lib/mail-query'
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
import type { LatencyRange, MailProvider } from './MailProvider'

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const FOLDER_DEFS: ReadonlyArray<{ id: string; name: string; type: MailFolder['type'] }> = [
  { id: 'inbox', name: 'INBOX', type: 'inbox' },
  { id: 'sent', name: 'SENT', type: 'sent' },
  { id: 'archive', name: 'ARCHIVE', type: 'archive' },
  { id: 'spam', name: 'SPAM', type: 'spam' },
  { id: 'trash', name: 'TRASH', type: 'trash' },
]

function buildFolders(messages: readonly MailMessage[]): MailFolder[] {
  return FOLDER_DEFS.map((def) => {
    const scoped = messages.filter((message) => message.folderId === def.id)
    return {
      id: def.id,
      name: def.name,
      type: def.type,
      messageCount: scoped.length,
      unreadCount: scoped.reduce((total, message) => total + (message.isRead ? 0 : 1), 0),
    }
  })
}

export interface MockMailProviderOptions {
  meta: MailProviderMeta
  address: string
  seed: readonly MailMessage[]
  latency: LatencyRange
}

export class MockMailProvider implements MailProvider {
  readonly meta: MailProviderMeta
  private messages: MailMessage[]
  private node: MailNode
  private readonly latencyRange: LatencyRange

  constructor(options: MockMailProviderOptions) {
    this.meta = options.meta
    this.latencyRange = options.latency
    this.messages = options.seed.map((message) => ({ ...message }))
    this.node = {
      id: options.meta.id,
      sequence: options.meta.sequence,
      provider: options.meta.id,
      label: options.meta.label,
      address: options.address,
      status: 'disconnected',
      unread: countUnread(this.messages),
      messageCount: this.messages.length,
      lastSyncAt: null,
      latencyMs: Math.round((options.latency[0] + options.latency[1]) / 2),
      folders: buildFolders(this.messages),
      mock: options.meta.mock,
    }
  }

  private wait(): Promise<void> {
    const [min, max] = this.latencyRange
    return delay(min + Math.random() * (max - min))
  }

  private refreshNode(patch: Partial<MailNode> = {}): MailNode {
    this.node = {
      ...this.node,
      unread: countUnread(this.messages),
      messageCount: this.messages.length,
      folders: buildFolders(this.messages),
      ...patch,
    }
    return this.node
  }

  private replace(next: MailMessage): MailMessage {
    this.messages = this.messages.map((message) => (message.id === next.id ? next : message))
    // 写操作后立即重算节点读数，UI 的 unread / folders 才不会滞后
    this.refreshNode()
    return next
  }

  private patch(id: string, patch: Partial<MailMessage>): MailMessage {
    const existing = this.messages.find((message) => message.id === id)
    if (!existing) throw new Error(`MESSAGE NOT FOUND: ${id}`)
    return this.replace({ ...existing, ...patch })
  }

  async connect(): Promise<MailNode> {
    await this.wait()
    return this.refreshNode({ status: 'connected', lastSyncAt: Date.now() })
  }

  async disconnect(): Promise<void> {
    await this.wait()
    this.refreshNode({ status: 'disconnected' })
  }

  getNode(): MailNode {
    return this.node
  }

  async getMessages(folderId?: string): Promise<MailMessage[]> {
    await this.wait()
    const scoped = folderId
      ? this.messages.filter((message) => message.folderId === folderId)
      : this.messages
    return [...scoped].sort((a, b) => b.timestamp - a.timestamp)
  }

  async getMessage(id: string): Promise<MailMessage | null> {
    await this.wait()
    return this.messages.find((message) => message.id === id) ?? null
  }

  async searchMessages(query: MailQuery): Promise<MailMessage[]> {
    await this.wait()
    return applyQuery(this.messages, query)
  }

  async markAsRead(id: string): Promise<MailMessage> {
    await this.wait()
    return this.patch(id, { isRead: true })
  }

  async markAsUnread(id: string): Promise<MailMessage> {
    await this.wait()
    return this.patch(id, { isRead: false })
  }

  async toggleStar(id: string): Promise<MailMessage> {
    await this.wait()
    const existing = this.messages.find((message) => message.id === id)
    if (!existing) throw new Error(`MESSAGE NOT FOUND: ${id}`)
    return this.patch(id, { isStarred: !existing.isStarred })
  }

  async archiveMessage(id: string): Promise<MailMessage> {
    await this.wait()
    return this.patch(id, { folderId: 'archive' })
  }

  async deleteMessage(id: string): Promise<MailMessage> {
    await this.wait()
    return this.patch(id, { folderId: 'trash' })
  }

  async getAttachments(id: string): Promise<MailAttachment[]> {
    await this.wait()
    return this.messages.find((message) => message.id === id)?.attachments ?? []
  }

  async sendMessage(draft: MailDraft): Promise<MailMessage> {
    await this.wait()
    const now = Date.now()
    const message: MailMessage = {
      id: `sent-${now.toString(36)}`,
      providerId: this.meta.id,
      threadId: `sent-${now.toString(36)}`,
      from: { name: this.node.label, address: this.node.address },
      to: draft.to.map((address) => ({ name: address, address })),
      cc: (draft.cc ?? []).map((address) => ({ name: address, address })),
      subject: draft.subject,
      preview: draft.body.replace(/\s+/g, ' ').trim().slice(0, 168),
      body: draft.body,
      timestamp: now,
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      attachments: [],
      labels: ['personal'],
      folderId: 'sent',
    }
    this.messages = [message, ...this.messages]
    this.refreshNode()
    return message
  }

  async getFolders(): Promise<MailFolder[]> {
    await this.wait()
    return buildFolders(this.messages)
  }

  async sync(): Promise<SyncResult> {
    const startedAt = Date.now()
    this.refreshNode({ status: 'syncing' })
    await delay(520 + Math.random() * 380)
    const fetched = this.messages.length
    this.refreshNode({ status: 'connected', lastSyncAt: Date.now() })
    return {
      nodeId: this.meta.id,
      fetched,
      newMessages: 0,
      syncedAt: Date.now(),
      durationMs: Date.now() - startedAt,
    }
  }
}
