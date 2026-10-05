import { cn } from '../../lib/cn'
import { useT } from '../../hooks'

export interface LoadingStateProps {
  /** 工业状态文本，例如 FETCHING MESSAGE INDEX */
  phase?: string
  detail?: string
  className?: string
}

/** 加载态：始终给出「正在做什么」的工程读数，绝不使用 Loading... */
export function LoadingState({ phase, detail, className }: LoadingStateProps) {
  const t = useT()

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-10', className)}>
      <span className="mcs-label mcs-label--signal mcs-blink">{phase ?? t('states.initializing')}</span>
      {detail ? <span className="mcs-num text-[11px] text-ink-2">{detail}</span> : null}
      <div className="mcs-progress-track h-[2px] w-[180px]">
        <div className="mcs-progress-thumb" />
      </div>
    </div>
  )
}

/** 顶部细进度条（用于面板级刷新） */
export function LoadingBar({ className }: { className?: string }) {
  return (
    <div className={cn('mcs-progress-track h-[2px] w-full', className)} role="progressbar">
      <div className="mcs-progress-thumb" />
    </div>
  )
}

export interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse bg-surface-2', className)} aria-hidden="true" />
}

/** 消息索引骨架行：保持与真实行相同的列结构 */
export function MessageSkeletonRows({ rows = 8 }: { rows?: number }) {
  return (
    <div className="divide-y divide-line">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-3 px-3 py-[11px]">
          <Skeleton className="h-2 w-2" />
          <Skeleton className="h-3 w-[84px]" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-[64px]" />
        </div>
      ))}
    </div>
  )
}
