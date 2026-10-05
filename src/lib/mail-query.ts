import type { MailMessage, MailQuery, SortField } from '../types'

/** 全文检索：主题 / 发件人 / 预览 / 正文 / 标签 */
export function matchesSearch(message: MailMessage, rawTerm: string): boolean {
  const term = rawTerm.trim().toLowerCase()
  if (!term) return true
  const tokens = term.split(/\s+/).filter(Boolean)
  const haystack = [
    message.subject,
    message.preview,
    message.body,
    message.from.name,
    message.from.address,
    message.to.map((t) => `${t.name} ${t.address}`).join(' '),
    message.labels.join(' '),
    message.verificationCode ?? '',
  ]
    .join('\n')
    .toLowerCase()

  return tokens.every((token) => haystack.includes(token))
}

function compare(field: SortField, a: MailMessage, b: MailMessage): number {
  switch (field) {
    case 'sender':
      return `${a.from.name}${a.from.address}`.localeCompare(
        `${b.from.name}${b.from.address}`,
      )
    case 'subject':
      return a.subject.localeCompare(b.subject)
    case 'time':
    default:
      return a.timestamp - b.timestamp
  }
}

export function sortMessages(
  messages: readonly MailMessage[],
  field: SortField,
  order: 'asc' | 'desc',
): MailMessage[] {
  const factor = order === 'asc' ? 1 : -1
  return [...messages].sort((a, b) => {
    const primary = compare(field, a, b) * factor
    // 次级排序始终按时间倒序，保证读数稳定
    if (primary !== 0) return primary
    return b.timestamp - a.timestamp
  })
}

/**
 * 应用完整查询条件（搜索 + 筛选 + 排序）。
 * Provider 的 searchMessages() 最终也委托到这里，保证 UI 与 Provider 行为一致。
 */
export function applyQuery(
  messages: readonly MailMessage[],
  query: MailQuery,
): MailMessage[] {
  const folder = query.folderId
  const filtered = messages.filter((message) => {
    if (folder !== 'all' && message.folderId !== folder) return false
    if (query.providerId !== 'all' && message.providerId !== query.providerId)
      return false
    if (query.read === 'read' && !message.isRead) return false
    if (query.read === 'unread' && message.isRead) return false
    if (query.starredOnly && !message.isStarred) return false
    if (query.attachmentOnly && !message.hasAttachment) return false
    if (query.label !== 'all' && !message.labels.includes(query.label)) return false
    if (!matchesSearch(message, query.search)) return false
    return true
  })

  return sortMessages(filtered, query.sort, query.order)
}

export function countUnread(messages: readonly MailMessage[]): number {
  return messages.reduce((total, message) => total + (message.isRead ? 0 : 1), 0)
}

/** 是否存在任何激活中的筛选条件（用于 Empty State 文案区分） */
export function hasActiveFilters(query: MailQuery): boolean {
  return (
    query.search.trim().length > 0 ||
    query.providerId !== 'all' ||
    query.read !== 'all' ||
    query.starredOnly ||
    query.attachmentOnly ||
    query.label !== 'all'
  )
}
