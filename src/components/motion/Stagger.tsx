import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Stagger — 容器级 stagger 编排
 * 使用 variants + staggerChildren，避免逐个子组件手写 delay。
 */

export interface StaggerProps {
  children: ReactNode
  className?: string
  /** 子项延迟步长（秒） */
  step?: number
  delay?: number
  once?: boolean
}

export const staggerItem = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0 },
}

export function Stagger({
  children,
  className = '',
  step = 0.05,
  delay = 0,
  once = true,
}: StaggerProps) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.1 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export interface StaggerItemProps {
  children: ReactNode
  className?: string
  duration?: number
}

export function StaggerItem({ children, className = '', duration = 0.16 }: StaggerItemProps) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={staggerItem}
      transition={{ duration, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default Stagger
