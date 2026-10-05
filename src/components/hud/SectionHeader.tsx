import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * 区块标题：大号描边编号 + 英文注记 + 信号色下划线。
 * 编号只做描边（不填充），保持「工程图纸」的克制感。
 */
export interface SectionHeaderProps {
  index: string
  label: string
  title?: string
  meta?: ReactNode
  className?: string
}

export function SectionHeader({ index, label, title, meta, className }: SectionHeaderProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 items-end gap-3">
          <span
            className="font-mono text-[38px] leading-[0.8] text-transparent select-none"
            style={{ WebkitTextStroke: '1px var(--color-line-strong)' }}
            aria-hidden="true"
          >
            {index}
          </span>
          <div className="pb-0.5">
            <span className="mcs-label mcs-label--signal whitespace-nowrap">{label}</span>
            {title ? (
              <h2 className="mt-1 text-[15px] leading-tight font-medium text-ink-0">{title}</h2>
            ) : null}
          </div>
        </div>
        {meta ? <div className="shrink-0 pb-0.5">{meta}</div> : null}
      </div>
      <div className="mt-2.5 h-[2px] w-[72px] bg-signal" />
    </div>
  )
}
