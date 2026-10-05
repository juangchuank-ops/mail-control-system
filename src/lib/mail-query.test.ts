import { describe, expect, it } from 'vitest'
import type { MailMessage } from '../types'
import { DEFAULT_QUERY } from '../types'
import { applyQuery, countUnread, hasActiveFilters, matchesSearch, sortMessages } from './mail-query'

function message(partial: Partial<MailMessage> & { id: string }): MailMessage {
  return {
    providerId: 'gmail',
    threadId: partial.id,
    from: { name: 'System', address: 'system@gmail.com' },
    to: [{ name: 'Operator', address: 'operator@gmail.com' }],
    cc: [],
    subject: 'Subject',
    preview: 'preview',
    body: 'body',
    timestamp: 1_700_000_000_000,
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    attachments: [],
    labels: [],
    folderId: 'inbox',
    ...partial,
  }
}

const FIXTURES: MailMessage[] = [
  message({
    id: 'a',
    subject: 'Google verification code',
    from: { name: 'Google', address: 'no-reply@google.com' },
    body: 'Your verification code is 482913',
    timestamp: 3_000,
    isRead: false,
    labels: ['verification'],
  }),
  message({
    id: 'b',
    subject: 'Invoice for October',
    from: { name: 'Billing', address: 'billing@example.com' },
    timestamp: 2_000,
    isStarred: true,
    hasAttachment: true,
    attachments: [{ id: 'f1', filename: 'invoice.pdf', mimeType: 'application/pdf', size: 1024 }],
    labels: ['billing'],
  }),
  message({
    id: 'c',
    providerId: 'qq',
    subject: '物流进度提醒',
    from: { name: '顺丰速运', address: 'sf@qq.com' },
    body: '您的包裹已发出',
    timestamp: 1_000,
    folderId: 'archive',
    labels: ['notification'],
  }),
]

describe('matchesSearch', () => {
  it('空查询匹配全部', () => {
    expect(matchesSearch(FIXTURES[0], '   ')).toBe(true)
  })

  it('命中主题 / 发件人 / 正文', () => {
    expect(matchesSearch(FIXTURES[0], 'verification')).toBe(true)
    expect(matchesSearch(FIXTURES[0], 'google')).toBe(true)
    expect(matchesSearch(FIXTURES[0], '482913')).toBe(true)
  })

  it('多关键词按 AND 语义匹配', () => {
    expect(matchesSearch(FIXTURES[0], 'google 482913')).toBe(true)
    expect(matchesSearch(FIXTURES[0], 'google invoice')).toBe(false)
  })
})

describe('sortMessages', () => {
  it('按时间倒序', () => {
    const sorted = sortMessages(FIXTURES, 'time', 'desc')
    expect(sorted.map((item) => item.id)).toEqual(['a', 'b', 'c'])
  })

  it('按时间正序', () => {
    const sorted = sortMessages(FIXTURES, 'time', 'asc')
    expect(sorted.map((item) => item.id)).toEqual(['c', 'b', 'a'])
  })
})

describe('applyQuery', () => {
  it('按节点筛选', () => {
    const result = applyQuery(FIXTURES, { ...DEFAULT_QUERY, folderId: 'all', providerId: 'qq' })
    expect(result.map((item) => item.id)).toEqual(['c'])
  })

  it('按已读状态筛选', () => {
    const result = applyQuery(FIXTURES, { ...DEFAULT_QUERY, folderId: 'all', read: 'unread' })
    expect(result.map((item) => item.id)).toEqual(['a'])
  })

  it('按星标与附件筛选', () => {
    const result = applyQuery(FIXTURES, {
      ...DEFAULT_QUERY,
      folderId: 'all',
      starredOnly: true,
      attachmentOnly: true,
    })
    expect(result.map((item) => item.id)).toEqual(['b'])
  })

  it('按标签筛选', () => {
    const result = applyQuery(FIXTURES, { ...DEFAULT_QUERY, folderId: 'all', label: 'billing' })
    expect(result.map((item) => item.id)).toEqual(['b'])
  })

  it('文件夹默认限定为 inbox', () => {
    const result = applyQuery(FIXTURES, DEFAULT_QUERY)
    expect(result.map((item) => item.id)).toEqual(['a', 'b'])
  })
})

describe('countUnread', () => {
  it('统计未读数量', () => {
    expect(countUnread(FIXTURES)).toBe(1)
  })
})

describe('hasActiveFilters', () => {
  it('默认查询视为无激活筛选', () => {
    expect(hasActiveFilters(DEFAULT_QUERY)).toBe(false)
  })

  it('搜索词与筛选切换都会激活', () => {
    expect(hasActiveFilters({ ...DEFAULT_QUERY, search: 'code' })).toBe(true)
    expect(hasActiveFilters({ ...DEFAULT_QUERY, starredOnly: true })).toBe(true)
    expect(hasActiveFilters({ ...DEFAULT_QUERY, providerId: 'qq' })).toBe(true)
  })
})
