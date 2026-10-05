import { motion, useReducedMotion } from 'motion/react'

/**
 * SignalSweep — 黄色信号线扫场
 * 用于 NODE ACTIVATION（节点切换）与 COPY CODE 确认反馈。
 * 不是粒子爆炸，只是一条精确的信号线。
 */

export interface SignalSweepProps {
  /** 变化时重播动画 */
  trigger: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
  duration?: number
}

export function SignalSweep({
  trigger,
  orientation = 'horizontal',
  className = '',
  duration = 0.32,
}: SignalSweepProps) {
  const reduced = useReducedMotion()
  if (reduced) return null

  const isHorizontal = orientation === 'horizontal'

  return (
    <motion.div
      key={trigger}
      aria-hidden="true"
      className={`pointer-events-none absolute z-[var(--z-hud)] ${
        isHorizontal ? 'inset-x-0 top-0 h-px' : 'inset-y-0 left-0 w-px'
      } ${className}`}
      style={{ backgroundColor: 'var(--color-signal)' }}
      initial={isHorizontal ? { scaleX: 0, opacity: 0.9 } : { scaleY: 0, opacity: 0.9 }}
      animate={isHorizontal ? { scaleX: 1, opacity: 0 } : { scaleY: 1, opacity: 0 }}
      transition={{ duration, ease: [0.2, 0, 0, 1] }}
    />
  )
}

export default SignalSweep
