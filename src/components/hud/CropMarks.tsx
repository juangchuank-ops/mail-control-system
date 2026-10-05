import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'

/**
 * 视口裁切标记：贴在屏幕四角，模拟取景器 / 工程图纸。
 * 固定在视口层，不参与文档流。
 */
export function CropMarks({ inset = 8, size = 14 }: { inset?: number; size?: number }) {
  const segments: Array<{ key: string; style: CSSProperties }> = [
    { key: 'tl-h', style: { top: inset, left: inset, width: size, height: 1 } },
    { key: 'tl-v', style: { top: inset, left: inset, width: 1, height: size } },
    { key: 'tr-h', style: { top: inset, right: inset, width: size, height: 1 } },
    { key: 'tr-v', style: { top: inset, right: inset, width: 1, height: size } },
    { key: 'bl-h', style: { bottom: inset, left: inset, width: size, height: 1 } },
    { key: 'bl-v', style: { bottom: inset, left: inset, width: 1, height: size } },
    { key: 'br-h', style: { bottom: inset, right: inset, width: size, height: 1 } },
    { key: 'br-v', style: { bottom: inset, right: inset, width: 1, height: size } },
  ]

  return (
    <div className="pointer-events-none fixed inset-0 z-[var(--z-sticky)]" aria-hidden="true">
      {segments.map((segment) => (
        <span
          key={segment.key}
          className={cn('absolute bg-line-strong')}
          style={segment.style}
        />
      ))}
    </div>
  )
}
