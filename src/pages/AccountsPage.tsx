import { useState } from 'react'
import { Plug, RefreshCw, RotateCcw, Trash, WifiOff } from 'lucide-react'
import { cn } from '../lib/cn'
import { formatCount, formatDateTime, formatRelative } from '../lib/format'
import { useLanguage, useT } from '../hooks'
import { useMailStore } from '../store'
import type { MailNode } from '../types'
import type { MessageKey } from '../lib/i18n'
import { MetricReadout, SectionHeader } from '../components/hud'
import { Badge, Button, EmptyState, Modal, Panel, StatusLed } from '../components/ui'
import type { LedTone } from '../components/ui'
import { CountUp } from '../components/motion'

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

const HEADERS: ReadonlyArray<{ key: MessageKey; alignRight?: boolean }> = [
  { key: 'accounts.header.node' },
  { key: 'accounts.header.email' },
  { key: 'accounts.header.status' },
  { key: 'accounts.header.lastSync' },
  { key: 'accounts.header.messages', alignRight: true },
  { key: 'accounts.header.unread', alignRight: true },
  { key: 'accounts.header.link' },
]

/** 节点账户管理（/accounts）：链路级操作 — CONNECT / DISCONNECT / SYNC / REMOVE */
export function AccountsPage() {
  const t = useT()
  const language = useLanguage()
  const nodes = useMailStore((state) => state.nodes)
  const syncStatus = useMailStore((state) => state.syncStatus)
  const connectNode = useMailStore((state) => state.connectNode)
  const disconnectNode = useMailStore((state) => state.disconnectNode)
  const syncNode = useMailStore((state) => state.syncNode)
  const removeNode = useMailStore((state) => state.removeNode)
  const restoreNodes = useMailStore((state) => state.restoreNodes)

  const [removing, setRemoving] = useState<MailNode | null>(null)
  const busy = syncStatus === 'syncing'

  const connected = nodes.filter((node) => node.status === 'connected').length
  const totalMessages = nodes.reduce((total, node) => total + node.messageCount, 0)
  const totalUnread = nodes.reduce((total, node) => total + node.unread, 0)

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6">
      <SectionHeader
        index="04"
        label={t('section.accounts.label')}
        title={t('section.accounts.title')}
        meta={<span className="mcs-label">{t('accounts.meta', { n: nodes.length })}</span>}
      />

      <Panel variant="inset" className="mt-5 grid gap-4 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricReadout label={t('accounts.metric.nodes')} value={<CountUp to={nodes.length} />} />
        <MetricReadout
          label={t('accounts.metric.connected')}
          value={<CountUp to={connected} />}
          tone="signal"
        />
        <MetricReadout
          label={t('accounts.metric.messages')}
          value={<CountUp to={totalMessages} separator="," />}
        />
        <MetricReadout label={t('accounts.metric.unread')} value={<CountUp to={totalUnread} />} />
      </Panel>

      <Panel className="mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <span className="mcs-label mcs-label--signal">{t('accounts.register')}</span>
          {nodes.length > 0 ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                void restoreNodes()
              }}
            >
              <RotateCcw size={11} strokeWidth={1.75} />
              {t('accounts.restore')}
            </Button>
          ) : null}
        </div>

        {nodes.length === 0 ? (
          <EmptyState
            code={t('accounts.empty.code')}
            title={t('accounts.empty.title')}
            detail={t('accounts.empty.detail')}
            action={
              <Button
                size="sm"
                variant="signal"
                cut
                onClick={() => {
                  void restoreNodes()
                }}
              >
                {t('accounts.restore')}
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse">
              <thead>
                <tr className="border-b border-line-strong bg-panel-1">
                  {HEADERS.map((header) => (
                    <th
                      key={header.key}
                      scope="col"
                      className={cn(
                        'mcs-label px-3 py-2 text-left',
                        header.alignRight && 'text-right',
                      )}
                    >
                      {t(header.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => {
                  const offline = node.status === 'disconnected' || node.status === 'error'
                  return (
                    <tr
                      key={node.id}
                      className="border-b border-line transition-colors duration-[var(--motion-fast)] last:border-b-0 hover:bg-panel-0"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="mcs-num text-[11px] text-ink-3">{node.sequence}</span>
                          <span className="font-mono text-[12px] tracking-[0.14em] text-ink-0">
                            {node.label}
                          </span>
                          {node.mock ? <Badge tone="warn">MOCK</Badge> : null}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="mcs-num block truncate text-[11px] text-ink-1">
                          {node.address}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="mcs-label flex items-center gap-1.5">
                          <StatusLed
                            tone={STATUS_TONE[node.status]}
                            blink={node.status === 'syncing'}
                          />
                          <span className={offline ? 'text-ink-3' : undefined}>
                            {t(STATUS_KEY[node.status])}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="mcs-label block">
                          {formatRelative(node.lastSyncAt ?? Date.now(), language)}
                        </span>
                        <span className="mcs-num block text-[11px] text-ink-3">
                          {node.lastSyncAt ? formatDateTime(node.lastSyncAt) : t('accounts.never')}
                        </span>
                      </td>
                      <td className="mcs-num px-3 py-3 text-right text-[12px] text-ink-1">
                        {formatCount(node.messageCount)}
                      </td>
                      <td
                        className={cn(
                          'mcs-num px-3 py-3 text-right text-[12px]',
                          node.unread > 0 ? 'text-signal' : 'text-ink-3',
                        )}
                      >
                        {formatCount(node.unread)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            disabled={!offline}
                            onClick={() => {
                              void connectNode(node.id)
                            }}
                          >
                            <Plug size={11} strokeWidth={1.75} />
                            {t('accounts.connect')}
                          </Button>
                          <Button
                            size="sm"
                            disabled={node.status === 'disconnected'}
                            onClick={() => {
                              void disconnectNode(node.id)
                            }}
                          >
                            <WifiOff size={11} strokeWidth={1.75} />
                            {t('accounts.disconnect')}
                          </Button>
                          <Button
                            size="sm"
                            busy={busy}
                            disabled={offline}
                            onClick={() => {
                              void syncNode(node.id)
                            }}
                          >
                            <RefreshCw size={11} strokeWidth={1.75} />
                            {t('accounts.sync')}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              setRemoving(node)
                            }}
                          >
                            <Trash size={11} strokeWidth={1.75} />
                            {t('accounts.remove')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="mcs-label border-t border-line px-3 py-2 text-ink-3">
          {t('accounts.note')}
        </p>
      </Panel>

      <Modal
        open={removing !== null}
        onClose={() => {
          setRemoving(null)
        }}
        title={t('accounts.remove.title')}
        meta={removing ? `${removing.sequence} ${removing.label}` : undefined}
        footer={
          <>
            <Button
              size="sm"
              onClick={() => {
                setRemoving(null)
              }}
            >
              {t('accounts.remove.cancel')}
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                if (removing) removeNode(removing.id)
                setRemoving(null)
              }}
            >
              {t('accounts.remove.confirm')}
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-ink-1">{t('accounts.remove.body')}</p>
        <p className="mcs-label mt-3 text-ink-3">{t('accounts.remove.note')}</p>
      </Modal>
    </div>
  )
}
