import { Paperclip, RotateCcw, Star } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useT } from '../../hooks'
import { useMailStore } from '../../store'
import type { MessageKey } from '../../lib/i18n'
import type { MailLabel, MailQuery, ReadFilter, SortField, SortOrder } from '../../types'
import { SegmentedControl, Select } from '../ui'
import type { SelectOption } from '../ui'

type SortKey = 'time:desc' | 'time:asc' | 'sender:asc' | 'subject:asc'

const SORT_KEY: Record<SortKey, MessageKey> = {
  'time:desc': 'filter.sort.timeDesc',
  'time:asc': 'filter.sort.timeAsc',
  'sender:asc': 'filter.sort.sender',
  'subject:asc': 'filter.sort.subject',
}

const LABEL_KEY: Record<MailLabel | 'all', MessageKey> = {
  all: 'filter.allLabels',
  verification: 'label.verification',
  security: 'label.security',
  order: 'label.order',
  billing: 'label.billing',
  github: 'label.github',
  notification: 'label.notification',
  newsletter: 'label.newsletter',
  personal: 'label.personal',
}

const READ_KEY: Record<ReadFilter, MessageKey> = {
  all: 'filter.all',
  unread: 'filter.unread',
  read: 'filter.read',
}

export interface FilterBarProps {
  query: MailQuery
  onChange: (patch: Partial<MailQuery>) => void
  onReset: () => void
}

/** 筛选带：节点 / 已读态 / 星标 / 附件 / 标签 / 排序 */
export function FilterBar({ query, onChange, onReset }: FilterBarProps) {
  const t = useT()
  const nodes = useMailStore((state) => state.nodes)

  const sortOptions: SelectOption[] = (Object.keys(SORT_KEY) as SortKey[]).map((value) => ({
    value,
    label: t(SORT_KEY[value]),
  }))

  const labelOptions: SelectOption[] = (
    Object.keys(LABEL_KEY) as Array<MailLabel | 'all'>
  ).map((value) => ({ value, label: t(LABEL_KEY[value]) }))

  const readOptions: ReadonlyArray<{ value: ReadFilter; label: string }> = (
    Object.keys(READ_KEY) as ReadFilter[]
  ).map((value) => ({ value, label: t(READ_KEY[value]) }))

  const providerOptions: SelectOption[] = [
    { value: 'all', label: t('filter.allNodes') },
    ...nodes.map((node) => ({
      value: node.id,
      label: `${node.sequence} ${node.label}`,
    })),
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SegmentedControl
        label={t('filter.read.aria')}
        options={readOptions}
        value={query.read}
        onChange={(next) => {
          onChange({ read: next })
        }}
      />

      <Select
        aria-label={t('filter.node.aria')}
        className="w-auto"
        options={providerOptions}
        value={query.providerId}
        onChange={(next) => {
          onChange({ providerId: next as MailQuery['providerId'] })
        }}
      />

      <Select
        aria-label={t('filter.label.aria')}
        className="w-auto"
        options={labelOptions}
        value={query.label}
        onChange={(next) => {
          onChange({ label: next as MailLabel | 'all' })
        }}
      />

      <Select
        aria-label={t('filter.sort.aria')}
        className="w-auto"
        options={sortOptions}
        value={`${query.sort}:${query.order}`}
        onChange={(next) => {
          const [field, order] = next.split(':')
          onChange({ sort: field as SortField, order: order as SortOrder })
        }}
      />

      <button
        type="button"
        aria-pressed={query.starredOnly}
        onClick={() => {
          onChange({ starredOnly: !query.starredOnly })
        }}
        className={cn(
          'mcs-btn mcs-btn--sm',
          query.starredOnly && 'border-signal text-signal',
        )}
      >
        <Star size={11} strokeWidth={1.75} fill={query.starredOnly ? 'currentColor' : 'none'} />
        {t('filter.starred')}
      </button>

      <button
        type="button"
        aria-pressed={query.attachmentOnly}
        onClick={() => {
          onChange({ attachmentOnly: !query.attachmentOnly })
        }}
        className={cn(
          'mcs-btn mcs-btn--sm',
          query.attachmentOnly && 'border-signal text-signal',
        )}
      >
        <Paperclip size={11} strokeWidth={1.75} />
        {t('filter.files')}
      </button>

      <button type="button" onClick={onReset} className="mcs-btn mcs-btn--sm mcs-btn--ghost">
        <RotateCcw size={11} strokeWidth={1.75} />
        {t('filter.reset')}
      </button>
    </div>
  )
}
