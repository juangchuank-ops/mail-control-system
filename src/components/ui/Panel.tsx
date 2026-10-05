import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** 工程面板：直角、1px 边线，可选 L 型角标 */
export type PanelVariant = 'base' | 'raised' | 'inset'

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant
  /** 显示 L 型角标刻线 */
  frame?: boolean
  /** 角标常亮信号色 */
  signal?: boolean
  children?: ReactNode
}

export function Panel({
  variant = 'base',
  frame = false,
  signal = false,
  className,
  children,
  ...rest
}: PanelProps) {
  return (
    <div
      className={cn(
        'mcs-panel',
        variant === 'raised' && 'mcs-panel--raised',
        variant === 'inset' && 'mcs-panel--inset',
        frame && 'mcs-frame',
        signal && 'mcs-frame--signal',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/** 面板标题栏：左标签 + 右读数 */
export interface PanelHeaderProps {
  label: string
  meta?: ReactNode
  signal?: boolean
  className?: string
}

export function PanelHeader({ label, meta, signal = false, className }: PanelHeaderProps) {
  return (
    <div
      className={cn(
        'flex h-9 items-center justify-between border-b border-line px-3',
        className,
      )}
    >
      <span className={cn('mcs-label', signal && 'mcs-label--signal')}>{label}</span>
      {meta ? <span className="mcs-label">{meta}</span> : null}
    </div>
  )
}
