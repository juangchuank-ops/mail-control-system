import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Reveal — 页面/区块进入动画
 * 只做轻微位移 + 渐显，机械、快速、克制。
 */

export interface RevealProps {
  children: ReactNode
  /** 秒 */
  delay?: number
  duration?: number
  /** 位移方向 */
  from?: 'bottom' | 'left' | 'right' | 'top' | 'none'
  distance?: number
  className?: string
  once?: boolean
}

const OFFSETS: Record<NonNullable<RevealProps['from']>, { x: number; y: number }> = {
  bottom: { x: 0, y: 10 },
  top: { x: 0, y: -10 },
  left: { x: -12, y: 0 },
  right: { x: 12, y: 0 },
  none: { x: 0, y: 0 },
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.32,
  from = 'bottom',
  distance,
  className = '',
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion()
  const offset = OFFSETS[from]
  const scale = distance ? distance / 10 : 1

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x * scale, y: offset.y * scale }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ duration, delay, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
