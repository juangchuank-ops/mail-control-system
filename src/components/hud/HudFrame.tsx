import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { ScanLine } from './GridBackdrop'

/** 四角刻线：内置在任意 relative 容器里，标记「取景框」 */
export interface CornerMarksProps {
  size?: number
  tone?: 'line' | 'signal'
  className?: string
}

export function CornerMarks({ size = 10, tone = 'line', className }: CornerMarksProps) {
  const color = tone === 'signal' ? 'bg-signal' : 'bg-line-strong'
  const thickness = '1px'
  const marks = [
    { key: 'tl-h', style: { top: 0, left: 0, width: size, height: thickness } },
    { key: 'tl-v', style: { top: 0, left: 0, width: thickness, height: size } },
    { key: 'tr-h', style: { top: 0, right: 0, width: size, height: thickness } },
    { key: 'tr-v', style: { top: 0, right: 0, width: thickness, height: size } },
    { key: 'bl-h', style: { bottom: 0, left: 0, width: size, height: thickness } },
    { key: 'bl-v', style: { bottom: 0, left: 0, width: thickness, height: size } },
    { key: 'br-h', style: { bottom: 0, right: 0, width: size, height: thickness } },
    { key: 'br-v', style: { bottom: 0, right: 0, width: thickness, height: size } },
  ] as const

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 z-[var(--z-hud)]', className)}
    >
      {marks.map((mark) => (
        <span key={mark.key} className={cn('absolute', color)} style={mark.style} />
      ))}
    </div>
  )
}

/** 十字准星：作为区块的视觉锚点，不做装饰堆砌 */
export function Crosshair({
  size = 12,
  tone = 'line',
  className,
}: {
  size?: number
  tone?: 'line' | 'signal'
  className?: string
}) {
  const color = tone === 'signal' ? 'bg-signal' : 'bg-line-strong'
  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none relative inline-block', className)}
      style={{ width: size, height: size }}
    >
      <span
        className={cn('absolute left-1/2 -translate-x-1/2', color)}
        style={{ width: 1, height: size }}
      />
      <span
        className={cn('absolute top-1/2 -translate-y-1/2', color)}
        style={{ height: 1, width: size }}
      />
    </span>
  )
}

/** HUD 外框：面板 + 四角刻线 + 可选扫描线 */
export interface HudFrameProps {
  children?: ReactNode
  className?: string
  marks?: boolean
  tone?: 'line' | 'signal'
  scan?: boolean
}

export function HudFrame({
  children,
  className,
  marks = true,
  tone = 'line',
  scan = false,
}: HudFrameProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {scan ? <ScanLine /> : null}
      {marks ? <CornerMarks tone={tone} /> : null}
    </div>
  )
}
