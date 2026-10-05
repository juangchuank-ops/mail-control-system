import { useInterval, useT } from '../../hooks'
import { formatClock, pad } from '../../lib/format'
import { useMailStore } from '../../store'
import { CoordinateReadout, RecIndicator } from '../hud'
import { cn } from '../../lib/cn'
import { useState } from 'react'

/** 系统状态栏：底部 28px 工程读数带 */
export function StatusBar() {
  const t = useT()
  const [now, setNow] = useState(() => Date.now())
  const nodes = useMailStore((state) => state.nodes)
  const indexMessages = useMailStore((state) => state.indexMessages)
  const query = useMailStore((state) => state.query)
  const syncStatus = useMailStore((state) => state.syncStatus)
  const activeNodeId = useMailStore((state) => state.activeNodeId)

  useInterval(() => setNow(Date.now()), 1000)

  const activeNode = nodes.find((node) => node.id === activeNodeId)
  const unread = indexMessages.reduce((total, message) => total + (message.isRead ? 0 : 1), 0)
  const online = nodes.filter((node) => node.status === 'connected').length

  return (
    <footer className="sticky bottom-0 z-[var(--z-sticky)] border-t border-line bg-surface-0">
      <div className="flex h-[var(--statusbar-h)] items-center justify-between gap-4 px-3">
        <CoordinateReadout
          items={[
            { label: t('status.node'), value: activeNode ? activeNode.sequence : '--' },
            { label: t('status.index'), value: pad(indexMessages.length, 3) },
            { label: t('status.unread'), value: pad(unread, 2) },
            { label: t('status.links'), value: `${online}/${nodes.length}` },
            {
              label: t('status.filter'),
              value: query.providerId === 'all' ? t('status.all') : query.providerId.toUpperCase(),
            },
          ]}
        />

        <div className="flex items-center gap-3">
          <span className="mcs-label hidden sm:inline">
            {syncStatus === 'syncing' ? t('status.syncing') : t('status.idle')}
          </span>
          <span className="mcs-num text-[11px] text-ink-1">{formatClock(now)}</span>
          <RecIndicator
            label={syncStatus === 'syncing' ? t('status.busy') : t('status.ready')}
            tone={syncStatus === 'syncing' ? 'danger' : 'signal'}
            className={cn(syncStatus === 'syncing' && 'text-danger')}
          />
        </div>
      </div>
    </footer>
  )
}
