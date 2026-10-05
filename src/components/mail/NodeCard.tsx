import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useLanguage, useT } from '../../hooks'
import { formatCount, formatRelative } from '../../lib/format'
import type { MessageKey } from '../../lib/i18n'
import type { MailNode } from '../../types'
import { SignalSweep } from '../motion'
import { NodeSequencePlate } from '../hud'
import { Badge, StatusLed } from '../ui'
import type { LedTone } from '../ui'

const STATUS_TONE: Record<MailNode['status'], LedTone> = {
  connected: 'ok',
  syncing: 'signal',
  disconnected: 'idle',
  error: 'danger',
}

const STATUS_KEY: Record<MailNode['status'], MessageKey> = {
  connected: 'node.status.connected',
  syncing: 'node.status.syncing',
  disconnected: 'node.status.disconnected',
  error: 'node.status.error',
}

export interface NodeCardProps {
  node: MailNode
  active: boolean
  busy?: boolean
  onSelect: (node: MailNode) => void
  onSync: (node: MailNode) => void
}

/** 单个通讯节点卡片 */
export function NodeCard({ node, active, busy = false, onSelect, onSync }: NodeCardProps) {
  const t = useT()
  const language = useLanguage()
  const offline = node.status === 'disconnected' || node.status === 'error'

  return (
    <div
      className={cn(
        'mcs-panel mcs-frame relative overflow-hidden transition-colors duration-[var(--motion-panel)]',
        active ? 'border-signal bg-panel-1' : 'hover:border-line-strong',
      )}
    >
      <SignalSweep trigger={active ? `${node.id}-on` : `${node.id}-off`} orientation="vertical" />
      {active ? <span className="absolute inset-y-0 left-0 w-[2px] bg-signal" /> : null}

      <button
        type="button"
        onClick={() => {
          onSelect(node)
        }}
        aria-pressed={active}
        className="block w-full px-3 pt-3 pb-2 text-left"
      >
        <div className="flex items-center gap-2.5">
          <NodeSequencePlate sequence={node.sequence} active={active} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={cn('font-mono text-[12px] tracking-[0.16em]', active ? 'text-signal' : 'text-ink-0')}>
                {node.label}
              </span>
              {node.mock ? <Badge tone="warn">MOCK</Badge> : null}
            </div>
            <p className="mcs-num mt-1 truncate text-[11px] text-ink-3">{node.address}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="mcs-label flex items-center gap-1.5">
            <StatusLed tone={STATUS_TONE[node.status]} blink={node.status === 'syncing'} />
            <span className={offline ? 'text-ink-3' : undefined}>{t(STATUS_KEY[node.status])}</span>
          </span>
          <span className="mcs-label">
            {formatRelative(node.lastSyncAt ?? Date.now(), language)}
          </span>
        </div>

        <div className="mcs-dashed mt-2.5 flex items-center justify-between pt-2.5">
          <span className="mcs-label">
            {t('node.msg')} <span className="mcs-num text-ink-1">{formatCount(node.messageCount)}</span>
          </span>
          <span className="mcs-label">
            {t('node.unread')}{' '}
            <span className={cn('mcs-num', node.unread > 0 ? 'text-signal' : 'text-ink-1')}>
              {formatCount(node.unread)}
            </span>
          </span>
          <span className="mcs-label">
            <span className="mcs-num text-ink-1">{node.latencyMs}</span>MS
          </span>
        </div>
      </button>

      <div className="flex items-stretch border-t border-line">
        <button
          type="button"
          onClick={() => {
            onSync(node)
          }}
          disabled={busy || offline}
          className="mcs-label flex flex-1 items-center justify-center gap-1.5 py-2 transition-colors duration-[var(--motion-ui)] hover:text-signal disabled:cursor-not-allowed disabled:opacity-35"
        >
          {offline ? (
            <WifiOff size={12} strokeWidth={1.75} />
          ) : (
            <RefreshCw size={12} strokeWidth={1.75} className={cn(busy && 'mcs-blink')} />
          )}
          {t('node.sync')}
        </button>
        <span className="w-px bg-line" />
        <span className="mcs-label flex flex-1 items-center justify-center gap-1.5 py-2 text-ink-3">
          <Wifi size={12} strokeWidth={1.75} />
          {active ? t('node.active') : t('node.standby')}
        </span>
      </div>
    </div>
  )
}
