import { create } from 'zustand'
import { translate } from '../lib/i18n'
import type { MessageKey, MessageParams } from '../lib/i18n'
import { applyQuery } from '../lib/mail-query'
import { buildProviders } from '../providers/mail'
import type { MailProvider } from '../providers/mail'
import { DEFAULT_QUERY } from '../types'
import type { MailMessage, MailNode, MailQuery, ProviderId } from '../types'
import { useSettingsStore } from './useSettingsStore'
import { useToastStore } from './useToastStore'

/**
 * 邮件控制中枢状态。
 *
 * 数据流：
 *   Provider（网络层）
 *     → nodeMessages（每个节点各自的原始缓存）
 *       → flatten → applyQuery(query) → indexMessages（MESSAGE INDEX 显示行）
 *         → selectedMessage（MESSAGE DETAIL 显示行）
 *
 * 查询变更只做内存重算，不重复请求 Provider；同步才会真正拉取。
 */

export const PROVIDER_IDS: readonly ProviderId[] = ['gmail', 'qq', 'outlook']

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

/** Provider 实例常驻，跨渲染保持状态（未读、星标等写操作落在实例内部） */
let providerCache: Record<ProviderId, MailProvider> | null = null

function providers(): Record<ProviderId, MailProvider> {
  if (!providerCache) {
    const map = {} as Record<ProviderId, MailProvider>
    for (const provider of buildProviders()) {
      map[provider.meta.id] = provider
    }
    providerCache = map
  }
  return providerCache
}

function flatten(cache: Partial<Record<ProviderId, MailMessage[]>>): MailMessage[] {
  const messages: MailMessage[] = []
  for (const id of PROVIDER_IDS) {
    const list = cache[id]
    if (list) messages.push(...list)
  }
  return messages
}

function patchCache(
  cache: Partial<Record<ProviderId, MailMessage[]>>,
  updated: MailMessage,
): Partial<Record<ProviderId, MailMessage[]>> {
  const next = { ...cache }
  const list = next[updated.providerId]
  if (list) {
    next[updated.providerId] = list.map((message) =>
      message.id === updated.id ? updated : message,
    )
  }
  return next
}

function mergeNode(nodes: readonly MailNode[], snapshot: MailNode): MailNode[] {
  const next = nodes.map((node) => (node.id === snapshot.id ? snapshot : node))
  return next.length === 0 ? [snapshot] : next
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

/** 按当前界面语言取词（用于状态层产出的 Toast 文案） */
function t(key: MessageKey, params?: MessageParams): string {
  return translate(useSettingsStore.getState().language, key, params)
}

interface MailState {
  initialized: boolean
  nodes: MailNode[]
  activeNodeId: ProviderId
  nodeMessages: Partial<Record<ProviderId, MailMessage[]>>
  indexMessages: MailMessage[]
  indexStatus: LoadStatus
  detailStatus: LoadStatus
  syncStatus: 'idle' | 'syncing'
  selectedMessageId: string | null
  selectedMessage: MailMessage | null
  query: MailQuery
  error: string | null

  initialize: () => Promise<void>
  selectNode: (id: ProviderId) => void
  refreshIndex: () => Promise<void>
  selectMessage: (id: string | null) => Promise<void>
  toggleRead: (id: string) => Promise<void>
  toggleStar: (id: string) => Promise<void>
  archiveMessage: (id: string) => Promise<void>
  removeMessage: (id: string) => Promise<void>
  setQuery: (patch: Partial<MailQuery>) => void
  resetQuery: () => void
  syncNode: (id?: ProviderId) => Promise<void>
  connectNode: (id: ProviderId) => Promise<void>
  disconnectNode: (id: ProviderId) => Promise<void>
  removeNode: (id: ProviderId) => void
  /** 重建全部 Provider 并重新连接，用于把已移除的节点与原记录恢复回来 */
  restoreNodes: () => Promise<void>
}

export const useMailStore = create<MailState>((set, get) => ({
  initialized: false,
  nodes: [],
  activeNodeId: 'gmail',
  nodeMessages: {},
  indexMessages: [],
  indexStatus: 'idle',
  detailStatus: 'idle',
  syncStatus: 'idle',
  selectedMessageId: null,
  selectedMessage: null,
  query: DEFAULT_QUERY,
  error: null,

  initialize: async () => {
    if (get().initialized) return
    set({ initialized: true, indexStatus: 'loading', error: null })
    try {
      const nodes = await Promise.all(PROVIDER_IDS.map((id) => providers()[id].connect()))
      const cache: Partial<Record<ProviderId, MailMessage[]>> = {}
      const snapshots = await Promise.all(
        nodes.map(async (node) => {
          cache[node.id] = await providers()[node.id].getMessages()
          return providers()[node.id].getNode()
        }),
      )
      set({
        nodes: snapshots,
        nodeMessages: cache,
        indexMessages: applyQuery(flatten(cache), get().query),
        indexStatus: 'ready',
      })
    } catch (error) {
      set({ indexStatus: 'error', error: toMessage(error) })
    }
  },

  selectNode: (id) => {
    const query: MailQuery = { ...get().query, providerId: id }
    set({
      activeNodeId: id,
      query,
      indexMessages: applyQuery(flatten(get().nodeMessages), query),
    })
  },

  refreshIndex: async () => {
    const missing = PROVIDER_IDS.filter((id) => !get().nodeMessages[id])
    if (missing.length === 0) {
      set({
        indexMessages: applyQuery(flatten(get().nodeMessages), get().query),
        indexStatus: 'ready',
      })
      return
    }
    set({ indexStatus: 'loading', error: null })
    try {
      const cache = { ...get().nodeMessages }
      for (const id of missing) {
        cache[id] = await providers()[id].getMessages()
      }
      set({
        nodeMessages: cache,
        indexMessages: applyQuery(flatten(cache), get().query),
        indexStatus: 'ready',
      })
    } catch (error) {
      set({ indexStatus: 'error', error: toMessage(error) })
    }
  },

  selectMessage: async (id) => {
    if (!id) {
      set({ selectedMessageId: null, selectedMessage: null, detailStatus: 'idle' })
      return
    }
    const cached = flatten(get().nodeMessages).find((message) => message.id === id) ?? null
    set({
      selectedMessageId: id,
      selectedMessage: cached,
      detailStatus: cached ? 'ready' : 'loading',
      error: null,
    })
    if (cached && cached.isRead) return

    try {
      let message = cached
      if (!message) {
        for (const providerId of PROVIDER_IDS) {
          const found = await providers()[providerId].getMessage(id)
          if (found) {
            message = found
            break
          }
        }
      }
      if (!message) {
        set({ selectedMessage: null, detailStatus: 'error', error: t('error.messageNotFound') })
        return
      }
      set({ selectedMessage: message, detailStatus: 'ready' })
      if (!message.isRead) await get().toggleRead(id)
    } catch (error) {
      set({ detailStatus: 'error', error: toMessage(error) })
    }
  },

  toggleRead: async (id) => {
    const current = flatten(get().nodeMessages).find((message) => message.id === id)
    if (!current) return
    const provider = providers()[current.providerId]
    const updated = current.isRead
      ? await provider.markAsUnread(id)
      : await provider.markAsRead(id)
    const nodeMessages = patchCache(get().nodeMessages, updated)
    set({
      nodeMessages,
      indexMessages: applyQuery(flatten(nodeMessages), get().query),
      nodes: mergeNode(get().nodes, provider.getNode()),
      selectedMessage:
        get().selectedMessageId === id ? updated : get().selectedMessage,
    })
  },

  toggleStar: async (id) => {
    const current = flatten(get().nodeMessages).find((message) => message.id === id)
    if (!current) return
    const updated = await providers()[current.providerId].toggleStar(id)
    const nodeMessages = patchCache(get().nodeMessages, updated)
    set({
      nodeMessages,
      indexMessages: applyQuery(flatten(nodeMessages), get().query),
      selectedMessage:
        get().selectedMessageId === id ? updated : get().selectedMessage,
    })
  },

  archiveMessage: async (id) => {
    const current = flatten(get().nodeMessages).find((message) => message.id === id)
    if (!current) return
    const provider = providers()[current.providerId]
    const updated = await provider.archiveMessage(id)
    const nodeMessages = patchCache(get().nodeMessages, updated)
    set({
      nodeMessages,
      indexMessages: applyQuery(flatten(nodeMessages), get().query),
      nodes: mergeNode(get().nodes, provider.getNode()),
      selectedMessageId: get().selectedMessageId === id ? null : get().selectedMessageId,
      selectedMessage: get().selectedMessageId === id ? null : get().selectedMessage,
      detailStatus: get().selectedMessageId === id ? 'idle' : get().detailStatus,
    })
  },

  removeMessage: async (id) => {
    const current = flatten(get().nodeMessages).find((message) => message.id === id)
    if (!current) return
    const provider = providers()[current.providerId]
    const updated = await provider.deleteMessage(id)
    const nodeMessages = patchCache(get().nodeMessages, updated)
    set({
      nodeMessages,
      indexMessages: applyQuery(flatten(nodeMessages), get().query),
      nodes: mergeNode(get().nodes, provider.getNode()),
      selectedMessageId: get().selectedMessageId === id ? null : get().selectedMessageId,
      selectedMessage: get().selectedMessageId === id ? null : get().selectedMessage,
      detailStatus: get().selectedMessageId === id ? 'idle' : get().detailStatus,
    })
  },

  setQuery: (patch) => {
    const query: MailQuery = { ...get().query, ...patch }
    set({ query, indexMessages: applyQuery(flatten(get().nodeMessages), query) })
  },

  resetQuery: () => {
    const query = DEFAULT_QUERY
    set({ query, indexMessages: applyQuery(flatten(get().nodeMessages), query) })
  },

  syncNode: async (id) => {
    const target = id ?? get().activeNodeId
    const provider = providers()[target]
    set({ syncStatus: 'syncing', error: null })
    try {
      const result = await provider.sync()
      const nodeMessages = { ...get().nodeMessages, [target]: await provider.getMessages() }
      set({
        syncStatus: 'idle',
        nodes: mergeNode(get().nodes, provider.getNode()),
        nodeMessages,
        indexMessages: applyQuery(flatten(nodeMessages), get().query),
      })
      useToastStore.getState().push({
        title: t('toast.syncComplete', { seq: provider.meta.sequence }),
        detail: t('toast.syncDetail', { count: result.fetched, ms: result.durationMs }),
        tone: 'ok',
      })
    } catch (error) {
      set({ syncStatus: 'idle', error: toMessage(error) })
      useToastStore.getState().push({
        title: t('toast.syncFailed', { seq: provider.meta.sequence }),
        detail: toMessage(error),
        tone: 'danger',
      })
    }
  },

  connectNode: async (id) => {
    const provider = providers()[id]
    const snapshot = await provider.connect()
    set({ nodes: mergeNode(get().nodes, snapshot) })
    useToastStore.getState().push({
      title: t('toast.connected', { seq: provider.meta.sequence }),
      detail: snapshot.address,
      tone: 'signal',
    })
  },

  disconnectNode: async (id) => {
    const provider = providers()[id]
    await provider.disconnect()
    set({ nodes: mergeNode(get().nodes, provider.getNode()) })
    useToastStore.getState().push({
      title: t('toast.disconnected', { seq: provider.meta.sequence }),
      detail: provider.getNode().address,
      tone: 'default',
    })
  },

  removeNode: (id) => {
    const nodeMessages = { ...get().nodeMessages }
    delete nodeMessages[id]
    const nodes = get().nodes.filter((node) => node.id !== id)
    const activeNodeId =
      get().activeNodeId === id ? (nodes[0]?.id ?? get().activeNodeId) : get().activeNodeId
    const query: MailQuery =
      get().query.providerId === id ? { ...get().query, providerId: 'all' } : get().query

    set({
      nodes,
      nodeMessages,
      activeNodeId,
      query,
      indexMessages: applyQuery(flatten(nodeMessages), query),
      selectedMessageId: null,
      selectedMessage: null,
      detailStatus: 'idle',
    })

    useToastStore.getState().push({
      title: t('toast.removed', { name: id.toUpperCase() }),
      detail: t('toast.detached'),
      tone: 'danger',
    })
  },

  restoreNodes: async () => {
    providerCache = null
    set({
      initialized: false,
      nodes: [],
      nodeMessages: {},
      indexMessages: [],
      indexStatus: 'idle',
      detailStatus: 'idle',
      selectedMessageId: null,
      selectedMessage: null,
      query: DEFAULT_QUERY,
      error: null,
    })
    await get().initialize()
    useToastStore.getState().push({
      title: t('toast.restored'),
      detail: t('toast.restoredDetail', { n: get().nodes.length }),
      tone: 'signal',
    })
  },
}))
