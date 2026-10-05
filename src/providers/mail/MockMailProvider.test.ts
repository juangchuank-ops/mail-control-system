import { beforeEach, describe, expect, it } from 'vitest'
import type { MailMessage, MailProviderMeta } from '../../types'
import { MockMailProvider } from './MockMailProvider'

const META: MailProviderMeta = { id: 'gmail', label: 'GMAIL', sequence: '01', mock: true }

function message(id: string, partial: Partial<MailMessage> = {}): MailMessage {
  return {
    id,
    providerId: 'gmail',
    threadId: id,
    from: { name: 'Google', address: 'no-reply@google.com' },
    to: [{ name: 'Operator', address: 'operator.control@gmail.com' }],
    cc: [],
    subject: `Subject ${id}`,
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

function build(): MockMailProvider {
  return new MockMailProvider({
    meta: META,
    address: 'operator.control@gmail.com',
    seed: [
      message('m1', { timestamp: 2_000, isRead: false }),
      message('m2', { timestamp: 3_000, isStarred: true }),
    ],
    latency: [0, 0],
  })
}

describe('MockMailProvider', () => {
  let provider: MockMailProvider

  beforeEach(() => {
    provider = build()
  })

  it('初始状态为未连接且带节点读数', () => {
    const node = provider.getNode()
    expect(node.status).toBe('disconnected')
    expect(node.messageCount).toBe(2)
    expect(node.unread).toBe(1)
    expect(node.lastSyncAt).toBeNull()
  })

  it('connect 建立链路并记录同步时间', async () => {
    const node = await provider.connect()
    expect(node.status).toBe('connected')
    expect(node.lastSyncAt).not.toBeNull()
  })

  it('getMessages 按时间倒序返回', async () => {
    const messages = await provider.getMessages()
    expect(messages.map((item) => item.id)).toEqual(['m2', 'm1'])
  })

  it('markAsRead / markAsUnread 切换已读态并同步节点读数', async () => {
    const read = await provider.markAsRead('m1')
    expect(read.isRead).toBe(true)
    expect(provider.getNode().unread).toBe(0)

    const unread = await provider.markAsUnread('m2')
    expect(unread.isRead).toBe(false)
    expect(provider.getNode().unread).toBe(1)
  })

  it('toggleStar 翻转星标', async () => {
    const starred = await provider.toggleStar('m1')
    expect(starred.isStarred).toBe(true)
    const unstarred = await provider.toggleStar('m1')
    expect(unstarred.isStarred).toBe(false)
  })

  it('archiveMessage 移入 archive，deleteMessage 移入 trash', async () => {
    expect((await provider.archiveMessage('m1')).folderId).toBe('archive')
    expect((await provider.deleteMessage('m2')).folderId).toBe('trash')
  })

  it('操作不存在的记录时抛出错误', async () => {
    await expect(provider.markAsRead('missing')).rejects.toThrow('MESSAGE NOT FOUND')
  })

  it('getMessage 命中返回记录，未命中返回 null', async () => {
    expect((await provider.getMessage('m1'))?.id).toBe('m1')
    expect(await provider.getMessage('missing')).toBeNull()
  })

  it('sync 返回本次同步读数并恢复 connected', async () => {
    const result = await provider.sync()
    expect(result.nodeId).toBe('gmail')
    expect(result.fetched).toBe(2)
    expect(provider.getNode().status).toBe('connected')
  })

  it('sendMessage 写入 sent 目录并置顶', async () => {
    const sent = await provider.sendMessage({ to: ['a@b.com'], subject: 'Hi', body: 'Hello' })
    expect(sent.folderId).toBe('sent')
    const messages = await provider.getMessages()
    expect(messages[0]?.id).toBe(sent.id)
    expect(provider.getNode().messageCount).toBe(3)
  })
})
