import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * AnimatedList — 改造自 React Bits (reactbits.dev/AnimatedList)
 * 工业改造点：
 *  - 去掉 zoom/scale 与渐变遮罩，改为 left → right 的位移揭示
 *  - 单条动画 80–160ms，逐条 stagger 45ms（上限 320ms）
 *  - 支持 prefers-reduced-motion
 */

export interface AnimatedListProps<T> {
  items: readonly T[]
  getKey: (item: T, index: number) => string
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  itemClassName?: string
  /** 单条动画时长（秒） */
  duration?: number
  /** 逐条延迟步长（秒） */
  step?: number
  /** 延迟上限（秒） */
  maxDelay?: number
  /** 内容切换时用于整体重播动画 */
  replayKey?: string
}

export function AnimatedList<T>({
  items,
  getKey,
  renderItem,
  className = '',
  itemClassName = '',
  duration = 0.14,
  step = 0.045,
  maxDelay = 0.32,
  replayKey = '',
}: AnimatedListProps<T>) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={getKey(item, index)} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      {items.map((item, index) => (
        <motion.div
          key={`${replayKey}:${getKey(item, index)}`}
          className={itemClassName}
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration,
            delay: Math.min(index * step, maxDelay),
            ease: [0.2, 0, 0, 1],
          }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </div>
  )
}

export default AnimatedList
