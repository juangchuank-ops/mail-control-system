import { useEffect, useMemo, useState } from 'react'
import { cn } from '../../lib/cn'
import { useT } from '../../hooks'
import { hasActiveFilters } from '../../lib/mail-query'
import { useMailStore } from '../../store'
import type { ProviderId } from '../../types'
import type { MessageKey } from '../../lib/i18n'
import { AnimatedList } from '../motion'
import { SectionHeader } from '../hud'
import { LoadingBar } from '../ui'
import { INDEX_GRID, MessageRow } from './MessageRow'
import { LoadingMessages, MessageEmptyState, MessageErrorState } from './States'
import { MessageToolbar } from './MessageToolbar'

const PROVIDER_SHORT: Record<ProviderId, string> = {
  gmail: 'GMAIL',
  qq: 'QQ',
  outlook: 'OUTLOOK',
}

const PAGE_SIZE = 30

const COLUMNS = [
  { key: 'id', label: 'index.column.id', className: 'hidden md:block' },
  { key: 'time', label: 'index.column.time', className: '' },
  { key: 'node', label: 'index.column.node', className: 'hidden md:block' },
  { key: 'sender', label: 'index.column.sender', className: 'hidden md:block' },
  { key: 'subject', label: 'index.column.subject', className: '' },
  { key: 'status', label: 'index.column.status', className: 'text-right' },
] as const satisfies ReadonlyArray<{ key: string; label: MessageKey; className: string }>

/** 02 — MESSAGE INDEX：消息索引 */
export function MessageIndex({ className }: { className?: string }) {
  const t = useT()
  const messages = useMailStore((state) => state.indexMessages)
  const indexStatus = useMailStore((state) => state.indexStatus)
  const error = useMailStore((state) => state.error)
  const query = useMailStore((state) => state.query)
  const selectedMessageId = useMailStore((state) => state.selectedMessageId)
  const selectMessage = useMailStore((state) => state.selectMessage)
  const toggleStar = useMailStore((state) => state.toggleStar)
  const toggleRead = useMailStore((state) => state.toggleRead)
  const refreshIndex = useMailStore((state) => state.refreshIndex)
  const resetQuery = useMailStore((state) => state.resetQuery)

  const [visible, setVisible] = useState(PAGE_SIZE)

  const queryKey = useMemo(() => JSON.stringify(query), [query])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [queryKey])

  const shown = messages.slice(0, visible)
  const remaining = messages.length - shown.length
  const filtering = hasActiveFilters(query)

  return (
    <section className={cn('flex h-full min-h-0 flex-col border-line', className)}>
      <SectionHeader
        index="02"
        label={t('section.index.label')}
        title={t('section.index.title')}
        meta={<span className="mcs-label mcs-num">{t('index.records', { n: messages.length })}</span>}
        className="px-4 pt-5 pb-3"
      />

      <MessageToolbar />

      {indexStatus === 'loading' && messages.length > 0 ? <LoadingBar /> : null}

      <div
        className={cn(INDEX_GRID, 'border-b border-line-strong bg-panel-1 px-3 py-2')}
        role="row"
      >
        {COLUMNS.map((column) => (
          <span key={column.key} className={cn('mcs-label min-w-0 truncate', column.className)}>
            {t(column.label)}
          </span>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {indexStatus === 'error' && messages.length === 0 ? (
          <MessageErrorState
            detail={error ?? undefined}
            onRetry={() => {
              void refreshIndex()
            }}
          />
        ) : null}

        {(indexStatus === 'idle' || indexStatus === 'loading') && messages.length === 0 ? (
          <LoadingMessages />
        ) : null}

        {indexStatus === 'ready' && messages.length === 0 ? (
          <MessageEmptyState filtering={filtering} onReset={resetQuery} />
        ) : null}

        {messages.length > 0 ? (
          <>
            <AnimatedList
              items={shown}
              replayKey={queryKey}
              getKey={(message) => message.id}
              renderItem={(message) => (
                <MessageRow
                  message={message}
                  selected={message.id === selectedMessageId}
                  providerLabel={PROVIDER_SHORT[message.providerId]}
                  onSelect={(id) => {
                    void selectMessage(id)
                  }}
                  onToggleStar={(id) => {
                    void toggleStar(id)
                  }}
                  onToggleRead={(id) => {
                    void toggleRead(id)
                  }}
                />
              )}
            />

            {remaining > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setVisible((count) => count + PAGE_SIZE)
                }}
                className="mcs-label w-full border-b border-line py-3 transition-colors duration-[var(--motion-ui)] hover:bg-panel-0 hover:text-signal"
              >
                {t('index.loadMore', { n: Math.min(remaining, PAGE_SIZE), m: remaining })}
              </button>
            ) : (
              <div className="mcs-label flex items-center justify-center gap-2 py-3 text-ink-3">
                <span className="h-px w-6 bg-line" />
                {t('index.end')}
                <span className="h-px w-6 bg-line" />
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  )
}
