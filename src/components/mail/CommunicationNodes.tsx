import { cn } from '../../lib/cn'
import { useT } from '../../hooks'
import { useMailStore } from '../../store'
import { RecIndicator, SectionHeader } from '../hud'
import { Button, LoadingState } from '../ui'
import { NodeCard } from './NodeCard'

/** 01 — COMMUNICATION NODES：通讯节点柱 */
export function CommunicationNodes({ className }: { className?: string }) {
  const t = useT()
  const nodes = useMailStore((state) => state.nodes)
  const activeNodeId = useMailStore((state) => state.activeNodeId)
  const indexStatus = useMailStore((state) => state.indexStatus)
  const syncStatus = useMailStore((state) => state.syncStatus)
  const selectNode = useMailStore((state) => state.selectNode)
  const syncNode = useMailStore((state) => state.syncNode)
  const initialize = useMailStore((state) => state.initialize)

  const busy = syncStatus === 'syncing'

  return (
    <section className={cn('flex h-full min-h-0 flex-col border-line', className)}>
      <SectionHeader
        index="01"
        label={t('section.nodes.label')}
        title={t('section.nodes.title')}
        meta={<RecIndicator label={t('node.linked')} />}
        className="px-4 pt-5 pb-3"
      />

      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {indexStatus !== 'error' && nodes.length === 0 ? (
          <LoadingState phase={t('node.establishing')} detail={t('node.connecting')} />
        ) : null}

        {nodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            active={node.id === activeNodeId}
            busy={busy}
            onSelect={(target) => {
              selectNode(target.id)
            }}
            onSync={(target) => {
              void syncNode(target.id)
            }}
          />
        ))}
      </div>

      <div className="border-t border-line p-3">
        <Button
          className="w-full"
          variant="signal"
          cut
          busy={busy}
          onClick={() => {
            if (nodes.length === 0) {
              void initialize()
              return
            }
            void (async () => {
              for (const node of nodes) {
                if (node.status === 'disconnected') continue
                await syncNode(node.id)
              }
            })()
          }}
        >
          {t('node.syncAll')}
        </Button>
      </div>
    </section>
  )
}
