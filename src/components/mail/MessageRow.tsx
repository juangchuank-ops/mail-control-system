import { Paperclip, Star } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useLanguage, useT } from '../../hooks'
import { formatListTime, formatMessageRef } from '../../lib/format'
import type { MailMessage } from '../../types'
import { StatusLed } from '../ui'

/** MESSAGE INDEX 的列宽模板（表头与数据行必须共用） */
export const INDEX_GRID =
  'grid grid-cols-[54px_minmax(0,1fr)_48px] md:grid-cols-[48px_56px_64px_minmax(0,0.95fr)_minmax(0,1.45fr)_52px]'

export interface MessageRowProps {
  message: MailMessage
  selected: boolean
  providerLabel: string
  onSelect: (id: string) => void
  onToggleStar: (id: string) => void
  onToggleRead: (id: string) => void
}

/** 单条消息记录行 */
export function MessageRow({
  message,
  selected,
  providerLabel,
  onSelect,
  onToggleStar,
  onToggleRead,
}: MessageRowProps) {
  const t = useT()
  const language = useLanguage()
  const unread = !message.isRead

  return (
    <div
      role="row"
      aria-selected={selected}
      tabIndex={0}
      onClick={() => {
        onSelect(message.id)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(message.id)
        }
      }}
      className={cn(
        INDEX_GRID,
        'mcs-density-row group relative cursor-pointer items-center gap-2 border-b border-line px-3 transition-colors duration-[var(--motion-fast)]',
        selected ? 'bg-panel-1' : 'hover:bg-panel-0',
      )}
    >
      {selected ? <span className="absolute inset-y-0 left-0 w-[2px] bg-signal" /> : null}

      <span className="mcs-num hidden text-[11px] text-ink-3 md:block">
        {formatMessageRef(message.id)}
      </span>

      <span className="mcs-label truncate">{formatListTime(message.timestamp, language)}</span>

      <span className="mcs-label hidden truncate md:block">{providerLabel}</span>

      <span className="hidden min-w-0 md:block">
        <span className={cn('block truncate text-[12px]', unread ? 'text-ink-0' : 'text-ink-2')}>
          {message.from.name}
        </span>
        <span className="mcs-num block truncate text-[11px] text-ink-3">
          {message.from.address}
        </span>
      </span>

      <span className="min-w-0">
        <span className={cn('block truncate text-[12px]', unread ? 'text-ink-1' : 'text-ink-3')}>
          <span className="text-ink-3 md:hidden">{message.from.name} · </span>
          {message.subject}
        </span>
        <span className="block truncate text-[11px] text-ink-3">{message.preview}</span>
      </span>

      <span className="flex items-center justify-end gap-1">
        {message.hasAttachment ? (
          <Paperclip size={11} strokeWidth={1.75} className="shrink-0 text-ink-3" aria-label={t('row.attachment')} />
        ) : null}
        <button
          type="button"
          aria-label={message.isStarred ? t('row.star.remove') : t('row.star.add')}
          onClick={(event) => {
            event.stopPropagation()
            onToggleStar(message.id)
          }}
          className={cn(
            'p-0.5 transition-colors duration-[var(--motion-ui)]',
            message.isStarred ? 'text-signal' : 'text-ink-3 hover:text-ink-0',
          )}
        >
          <Star size={12} strokeWidth={1.75} fill={message.isStarred ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          aria-label={unread ? t('row.markRead') : t('row.markUnread')}
          onClick={(event) => {
            event.stopPropagation()
            onToggleRead(message.id)
          }}
          className="hidden p-0.5 md:inline-flex"
        >
          <StatusLed tone={unread ? 'signal' : 'idle'} />
        </button>
      </span>
    </div>
  )
}
