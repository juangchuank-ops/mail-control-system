import { useT } from '../../hooks'
import { EmptyState, ErrorState, MessageSkeletonRows } from '../ui'

/** 读取索引中的占位态：始终说明「正在读什么」 */
export function LoadingMessages({ phase }: { phase?: string }) {
  const t = useT()

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="mcs-label mcs-label--signal mcs-blink">{phase ?? t('states.loadingIndex')}</span>
        <div className="mcs-progress-track h-[2px] flex-1">
          <div className="mcs-progress-thumb" />
        </div>
      </div>
      <MessageSkeletonRows rows={9} />
    </div>
  )
}

export interface MessageEmptyStateProps {
  filtering: boolean
  onReset: () => void
}

/** 索引为空：区分「本节点没有邮件」与「筛选无命中」 */
export function MessageEmptyState({ filtering, onReset }: MessageEmptyStateProps) {
  const t = useT()

  if (filtering) {
    return (
      <EmptyState
        code={t('empty.filter.code')}
        title={t('empty.filter.title')}
        detail={t('empty.filter.detail')}
        action={
          <button type="button" className="mcs-btn mcs-btn--sm" onClick={onReset}>
            {t('empty.filter.action')}
          </button>
        }
      />
    )
  }
  return (
    <EmptyState
      code={t('empty.index.code')}
      title={t('empty.node.title')}
      detail={t('empty.node.detail')}
    />
  )
}

export interface MessageErrorStateProps {
  detail?: string
  onRetry: () => void
}

export function MessageErrorState({ detail, onRetry }: MessageErrorStateProps) {
  const t = useT()

  return (
    <div className="p-3">
      <ErrorState
        title={t('states.indexError')}
        detail={detail ?? t('states.connectionLost')}
        action={
          <button
            type="button"
            className="mcs-btn mcs-btn--sm"
            onClick={() => {
              onRetry()
            }}
          >
            {t('states.retry')}
          </button>
        }
      />
    </div>
  )
}
