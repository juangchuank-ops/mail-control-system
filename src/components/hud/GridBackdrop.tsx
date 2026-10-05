import { cn } from '../../lib/cn'

/** 工程网格背景（绝对定位铺满父容器） */
export function GridBackdrop({
  dense = false,
  className,
}: {
  dense?: boolean
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0',
        dense ? 'mcs-grid-bg--dense' : 'mcs-grid-bg',
        className,
      )}
    />
  )
}

/** 黄黑警示条：仅作分隔点缀，绝不整屏铺满 */
export function WarningStripe({
  muted = false,
  className,
}: {
  muted?: boolean
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('h-[3px] w-full', muted ? 'mcs-stripe--muted' : 'mcs-stripe', className)}
    />
  )
}

/** 扫描线：缓慢扫过容器，用于「正在处理」的区域 */
export function ScanLine({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('mcs-scan', className)} />
}
