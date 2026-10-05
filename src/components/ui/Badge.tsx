import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BadgeTone = 'default' | 'signal' | 'ok' | 'warn' | 'danger'

const TONE_CLASS: Record<BadgeTone, string> = {
  default: 'border-line-strong text-ink-2',
  signal: 'border-signal text-signal',
  ok: 'border-ok/60 text-ok',
  warn: 'border-warn/60 text-warn',
  danger: 'border-danger/60 text-danger',
}

export interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

/** 等宽小标签，用于标签 / 状态注记 */
export function Badge({ children, tone = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'mcs-label inline-flex items-center border px-1.5 py-0.5 whitespace-nowrap',
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export interface KeyValueRowProps {
  label: string
  value: ReactNode
  className?: string
}

/** 读数行：左键右值，值使用等宽数字 */
export function KeyValueRow({ label, value, className }: KeyValueRowProps) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 py-1', className)}>
      <span className="mcs-label shrink-0">{label}</span>
      <span className="mcs-num text-right text-[12px] text-ink-0">{value}</span>
    </div>
  )
}
