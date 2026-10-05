import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useT } from '../../hooks'

export interface EmptyStateProps {
  /** 工程编号式标题，如 NO MESSAGES */
  code: string
  title: string
  detail?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ code, title, detail, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col items-center justify-center px-6 py-10 text-center',
        className,
      )}
    >
      <span className="mcs-label mcs-label--signal">{code}</span>
      <p className="mt-3 text-[13px] text-ink-1">{title}</p>
      {detail ? <p className="mcs-clamp-3 mt-2 max-w-[42ch] text-[12px] text-ink-2">{detail}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export interface ErrorStateProps {
  title?: string
  detail?: string
  action?: ReactNode
  className?: string
}

export function ErrorState({ title, detail, action, className }: ErrorStateProps) {
  const t = useT()

  return (
    <div className={cn('mcs-panel border-danger/40 px-4 py-4', className)}>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 bg-danger" aria-hidden="true" />
        <span className="mcs-label text-danger">{title ?? t('states.linkFailure')}</span>
      </div>
      {detail ? <p className="mcs-num mt-2 text-[12px] text-ink-2">{detail}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}
