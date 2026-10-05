import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** 数值读数：标签 + 等宽数字 + 单位 */
export interface MetricReadoutProps {
  label: string
  value: ReactNode
  unit?: string
  tone?: 'default' | 'signal'
  className?: string
}

export function MetricReadout({
  label,
  value,
  unit,
  tone = 'default',
  className,
}: MetricReadoutProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className="mcs-label">{label}</span>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            'mcs-num text-[18px] leading-none',
            tone === 'signal' ? 'text-signal' : 'text-ink-0',
          )}
        >
          {value}
        </span>
        {unit ? <span className="mcs-label">{unit}</span> : null}
      </div>
    </div>
  )
}

/** 坐标读数：系统状态栏左侧的工程注记 */
export interface CoordinateReadoutProps {
  items: ReadonlyArray<{ label: string; value: string }>
  className?: string
}

export function CoordinateReadout({ items, className }: CoordinateReadoutProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {items.map((item) => (
        <span key={item.label} className="mcs-label flex items-center gap-1">
          <span className="text-ink-3">{item.label}</span>
          <span className="mcs-num text-ink-1">{item.value}</span>
        </span>
      ))}
    </div>
  )
}

/** 录制/在线指示：闪烁方块 + 标签 */
export function RecIndicator({
  label = 'LIVE',
  tone = 'signal',
  className,
}: {
  label?: string
  tone?: 'signal' | 'danger'
  className?: string
}) {
  return (
    <span className={cn('flex items-center gap-1.5', className)}>
      <span
        aria-hidden="true"
        className={cn('mcs-blink h-[6px] w-[6px]', tone === 'danger' ? 'bg-danger' : 'bg-signal')}
      />
      <span className={cn('mcs-label', tone === 'danger' ? 'text-danger' : 'text-signal')}>
        {label}
      </span>
    </span>
  )
}

/** 节点编号牌：大号等宽数字 + 切角 */
export function NodeSequencePlate({
  sequence,
  active = false,
  className,
}: {
  sequence: string
  active?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'mcs-cut-br mcs-num inline-flex h-7 w-9 items-center justify-center border text-[12px]',
        active
          ? 'border-signal bg-signal text-surface-0'
          : 'border-line-strong text-ink-2',
        className,
      )}
    >
      {sequence}
    </span>
  )
}
